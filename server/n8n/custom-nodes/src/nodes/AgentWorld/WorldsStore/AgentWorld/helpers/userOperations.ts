import { WorldNode, WorldData, createMeta } from '../../../interfaces'
import { findNode } from './nodeTraversal'
import { addNode, deleteNode } from './nodeOperations'
import * as crypto from 'crypto'

const USERS_NODE_ID = 'users'
const SESSIONS_NODE_ID = 'sessions'
const CONVERSATIONS_NODE_ID = 'conversations'

export interface UserData {
  userId?: string
  sessionId?: string
  [key: string]: unknown
}

export interface ConversationData {
  content: string
  [key: string]: unknown
}

export interface ResponseData {
  content: string
  type?: 'text' | 'tool_call' | string
  [key: string]: unknown
}

interface FindResult {
  user: WorldNode
  matchedBy: 'userId' | 'sessionId'
}

function generateNodeId(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase()
}

function getOrCreateUsersNode(data: WorldData): WorldNode {
  let usersNode = findNode(data.root, USERS_NODE_ID)

  if (!usersNode) {
    usersNode = {
      id: USERS_NODE_ID,
      type: 'users',
      // name: 'Users',
      // data: {},
      name: undefined,
      data: undefined,
      meta: createMeta(),
      children: [],
    }
    data.root.children.push(usersNode)
    data.root.meta.updatedAt = new Date().toISOString()
    data.updatedAt = new Date().toISOString()
  }

  return usersNode
}

function findUserByUserId(
  usersNode: WorldNode,
  userId: string,
): WorldNode | null {
  for (const user of usersNode.children) {
    if (user.data?.userId && user.data.userId === userId) {
      return user
    }
  }
  return null
}

function getOrCreateSessionsNode(user: WorldNode, data: WorldData): WorldNode {
  let sessionsNode = user.children.find(
    (child) => child.type === 'sessions' && child.id === SESSIONS_NODE_ID,
  )

  if (!sessionsNode) {
    sessionsNode = {
      id: SESSIONS_NODE_ID,
      type: 'sessions',
      // name: 'Sessions',
      name: undefined,
      data: {},
      meta: createMeta(),
      children: [],
    }
    user.children.push(sessionsNode)
    user.meta.updatedAt = new Date().toISOString()
    data.updatedAt = new Date().toISOString()
  }

  return sessionsNode
}

function findUserBySessionId(
  usersNode: WorldNode,
  sessionId: string,
): WorldNode | null {
  for (const user of usersNode.children) {
    const sessionsNode = user.children.find(
      (child) => child.type === 'sessions',
    )
    if (sessionsNode) {
      for (const session of sessionsNode.children) {
        if (session.type === 'session' && session.id === sessionId) {
          return user
        }
      }
    }
  }
  return null
}

function findAllMatchingUsers(
  usersNode: WorldNode,
  userId?: string,
  sessionId?: string,
): FindResult[] {
  const results: FindResult[] = []

  if (userId) {
    const user = findUserByUserId(usersNode, userId)
    if (user) {
      results.push({ user, matchedBy: 'userId' })
    }
  }

  if (sessionId) {
    const user = findUserBySessionId(usersNode, sessionId)
    if (user && !results.some((r) => r.user.id === user.id)) {
      results.push({ user, matchedBy: 'sessionId' })
    }
  }

  return results
}

function addSessionToUser(
  user: WorldNode,
  sessionId: string,
  data: WorldData,
): WorldNode {
  const sessionsNode = getOrCreateSessionsNode(user, data)

  const existingSession = sessionsNode.children.find(
    (s) => s.type === 'session' && s.id === sessionId,
  )

  if (existingSession) {
    existingSession.meta.updatedAt = new Date().toISOString()
    return existingSession
  }

  const session: WorldNode = {
    id: sessionId ?? generateNodeId(),
    type: 'session',
    // name: `Session ${sessionId}`,
    name: undefined,
    // data: { sessionId },
    data: undefined,
    meta: createMeta(),
    children: [],
  }

  sessionsNode.children.push(session)
  sessionsNode.meta.updatedAt = new Date().toISOString()
  user.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()

  return session
}

function mergeUsers(
  target: WorldNode,
  source: WorldNode,
  data: WorldData,
): void {
  // Merge data
  target.data = { ...source.data, ...target.data }

  // Get or create sessions node in target
  const targetSessionsNode = getOrCreateSessionsNode(target, data)

  // Find sessions node in source
  const sourceSessionsNode = source.children.find(
    (child) => child.type === 'sessions',
  )

  // Merge sessions from source to target
  if (sourceSessionsNode) {
    for (const session of sourceSessionsNode.children) {
      if (session.type === 'session') {
        const exists = targetSessionsNode.children.some(
          (s) => s.type === 'session' && s.id === session.id,
        )
        if (!exists) {
          targetSessionsNode.children.push(session)
        }
      }
    }
    targetSessionsNode.meta.updatedAt = new Date().toISOString()
  }

  target.meta.updatedAt = new Date().toISOString()

  // Delete source user
  deleteNode(data, source.id)
}

export function upsertUser(data: WorldData, userData: UserData): WorldNode {
  const { userId, sessionId, ...rest } = userData

  if (!userId && !sessionId) {
    throw new Error('Either userId or sessionId must be provided')
  }

  const usersNode = getOrCreateUsersNode(data)
  const matches = findAllMatchingUsers(usersNode, userId, sessionId)

  // Case: found user by sessionId only (no userId provided)
  if (!userId && sessionId && matches.length > 0) {
    const match = matches[0]
    if (match.user.data?.userId) {
      throw new Error(
        'Access denied: cannot access authorized user by session only',
      )
    }
    match.user.data = { ...match.user.data, ...rest }
    match.user.meta.updatedAt = new Date().toISOString()
    addSessionToUser(match.user, sessionId, data)
    data.updatedAt = new Date().toISOString()
    return match.user
  }

  // Case: both userId and sessionId provided
  if (userId && sessionId) {
    const userByUserId = matches.find((m) => m.matchedBy === 'userId')?.user
    const userBySession = matches.find((m) => m.matchedBy === 'sessionId')?.user

    // Check access for session-matched user
    if (
      userBySession &&
      userBySession.data?.userId &&
      userBySession.data?.userId !== userId
    ) {
      throw new Error(
        'Access denied: session belongs to another authorized user',
      )
    }

    if (userByUserId && userBySession && userByUserId.id !== userBySession.id) {
      // Merge: session user has no userId (anonymous), merge into authorized
      mergeUsers(userByUserId, userBySession, data)
      addSessionToUser(userByUserId, sessionId, data)

      userByUserId.data = { ...userByUserId.data, ...rest }
      userByUserId.meta.updatedAt = new Date().toISOString()
      data.updatedAt = new Date().toISOString()
      return userByUserId
    }

    if (userByUserId) {
      userByUserId.data = { ...userByUserId.data, ...rest }
      addSessionToUser(userByUserId, sessionId, data)
      userByUserId.meta.updatedAt = new Date().toISOString()
      data.updatedAt = new Date().toISOString()
      return userByUserId
    }

    if (userBySession) {
      userBySession.data = userBySession.data ?? {}
      // Anonymous user found by session, now authorizing
      userBySession.data.userId = userId

      userBySession.data = { ...userBySession.data, ...rest }
      userBySession.meta.updatedAt = new Date().toISOString()
      data.updatedAt = new Date().toISOString()
      return userBySession
    }
  }

  // Case: only userId provided
  if (userId && !sessionId && matches.length > 0) {
    const userNode = matches[0].user

    userNode.data = { ...userNode.data, ...rest }
    userNode.meta.updatedAt = new Date().toISOString()
    data.updatedAt = new Date().toISOString()
    return userNode
  }

  // Create new user
  const userNode = addNode(data, USERS_NODE_ID, {
    type: 'user',
    name: undefined,
    data: { userId, ...rest },
  })

  if (sessionId) {
    addSessionToUser(userNode, sessionId, data)
  }

  return userNode
}

export function getUser(
  data: WorldData,
  userId?: string,
  sessionId?: string,
): WorldNode | null {
  if (!userId && !sessionId) {
    throw new Error('No userId or sessionId provided')
  }

  const usersNode = findNode(data.root, USERS_NODE_ID)
  if (!usersNode) {
    return null
  }

  if (userId) {
    return findUserByUserId(usersNode, userId)
  }

  if (sessionId) {
    return findUserBySessionId(usersNode, sessionId)
  }

  return null
}

function getOrCreateConversationsNode(
  user: WorldNode,
  data: WorldData,
): WorldNode {
  let conversationsNode = user.children.find(
    (child) =>
      child.type === 'conversations' && child.id === CONVERSATIONS_NODE_ID,
  )

  if (!conversationsNode) {
    conversationsNode = {
      id: CONVERSATIONS_NODE_ID,
      type: 'conversations',
      // name: 'Conversations',
      name: undefined,
      // data: {},
      data: undefined,
      meta: createMeta(),
      children: [],
    }
    user.children.push(conversationsNode)
    user.meta.updatedAt = new Date().toISOString()
    data.updatedAt = new Date().toISOString()
  }

  return conversationsNode
}

export function addConversation(
  data: WorldData,
  user: WorldNode,
  conversationData: ConversationData,
): WorldNode {
  const conversationsNode = getOrCreateConversationsNode(user, data)

  const conversation: WorldNode = {
    id: generateNodeId(),
    // type: 'conversation',
    type: undefined,
    // name: '',
    name: undefined,
    data: {
      ...conversationData,
    },
    meta: createMeta(),
    children: [],
  }

  conversationsNode.children.push(conversation)
  conversationsNode.meta.updatedAt = new Date().toISOString()
  user.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()

  return conversation
}

export function addResponse(
  data: WorldData,
  conversation: WorldNode,
  responseData: ResponseData,
): WorldNode {
  const type = responseData.type || 'text'

  const response: WorldNode = {
    id: generateNodeId(),
    type: 'response',
    name: '',
    data: {
      ...responseData,
      type,
    },
    meta: createMeta(),
    children: [],
  }

  conversation.children.push(response)
  conversation.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()

  return response
}

export function getConversations(user: WorldNode): WorldNode[] {
  const conversationsNode = user.children.find(
    (child) => child.type === 'conversations',
  )

  // if (!conversationsNode) {
  //   return []
  // }

  // return conversationsNode.children.filter(
  //   (child) => child.type === 'conversation',
  // )

  return conversationsNode?.children ?? []
}

import {
  WorldNode,
  WorldData,
  ReadOptions,
  createMeta,
  WorldNodeRead,
} from '../../interfaces'
import {
  addNode,
  deleteNode,
  moveNode,
  updateNode,
} from './helpers/nodeOperations'
import { expandNode, readWorld } from './helpers/nodeRead'
import { findNode } from './helpers/nodeTraversal'
import {
  upsertUser,
  getUser,
  addConversation,
  addResponse,
  getConversations,
  UserData,
  ConversationData,
  ResponseData,
} from './helpers/userOperations'

function createRootNode(): WorldNode {
  return {
    id: 'root',
    type: 'root',
    name: 'World',
    data: {},
    meta: createMeta(),
    children: [],
  }
}

export class AgentWorld {
  private data: WorldData

  constructor(agentId: string, ownerId?: string) {
    const now = new Date().toISOString()
    const id = ownerId ? `${agentId}:${ownerId}` : agentId

    this.data = {
      id,
      agentId,
      ownerId,
      root: createRootNode(),
      createdAt: now,
      updatedAt: now,
    }
  }

  get id(): string {
    return this.data.id
  }

  get agentId(): string {
    return this.data.agentId
  }

  get ownerId(): string | undefined {
    return this.data.ownerId
  }

  get root(): WorldNode {
    return this.data.root
  }

  get createdAt(): string {
    return this.data.createdAt
  }

  get updatedAt(): string {
    return this.data.updatedAt
  }

  addNode(
    parentId: string,
    node: Omit<WorldNode, 'id' | 'meta' | 'children'>,
  ): WorldNode {
    return addNode(this.data, parentId, node)
  }

  updateNode(
    nodeId: string,
    data: Partial<Pick<WorldNode, 'name' | 'data'>>,
  ): WorldNode {
    return updateNode(this.data, nodeId, data)
  }

  read(options: ReadOptions = {}): WorldNodeRead {
    return readWorld(this.data.root, options)
  }

  expandNode(nodeId: string, depth: number = 3): WorldNodeRead {
    return expandNode(this.data.root, nodeId, depth)
  }

  deleteNode(nodeId: string): void {
    deleteNode(this.data, nodeId)
  }

  moveNode(nodeId: string, newParentId: string): WorldNode {
    return moveNode(this.data, nodeId, newParentId)
  }

  findNode(root: WorldNode, nodeId: string): WorldNode | null {
    return findNode(root, nodeId)
  }

  upsertUser(userData: UserData): WorldNode {
    return upsertUser(this.data, userData)
  }

  getUser(userId?: string, sessionId?: string): WorldNode | null {
    return getUser(this.data, userId, sessionId)
  }

  addConversation(
    user: WorldNode,
    conversationData: ConversationData,
  ): WorldNode {
    return addConversation(this.data, user, conversationData)
  }

  addResponse(conversation: WorldNode, responseData: ResponseData): WorldNode {
    return addResponse(this.data, conversation, responseData)
  }

  getConversations(user: WorldNode): WorldNode[] {
    return getConversations(user)
  }
}

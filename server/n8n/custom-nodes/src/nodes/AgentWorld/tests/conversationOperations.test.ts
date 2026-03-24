import { describe, it, expect, beforeEach } from 'vitest'
import { AgentWorld } from '../WorldsStore/AgentWorld'

describe('conversationOperations', () => {
  let world: AgentWorld

  beforeEach(() => {
    world = new AgentWorld('agent-1', 'user-1')
  })

  describe('addConversation', () => {
    it('creates Conversations node and adds conversation', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const conversation = world.addConversation(user, {
        content: 'Hello, how are you?',
      })

      expect(conversation.type).toBe(undefined)
      expect(conversation.data?.content).toBe('Hello, how are you?')
      expect(conversation.meta.createdAt).toBeDefined()

      const conversationsNode = user.children.find(
        (c) => c.type === 'conversations',
      )
      expect(conversationsNode).toBeDefined()
      expect(conversationsNode?.children).toHaveLength(1)
    })

    it('stores full content in data', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const longContent =
        'This is a very long message that should be stored in full'
      const conversation = world.addConversation(user, { content: longContent })

      expect(conversation.name).toBe(undefined)
      expect(conversation.data?.content).toBe(longContent)
    })

    it('adds multiple conversations to same user', () => {
      const user = world.upsertUser({ userId: 'u1' })
      world.addConversation(user, { content: 'First message' })
      world.addConversation(user, { content: 'Second message' })

      const conversations = world.getConversations(user)
      expect(conversations).toHaveLength(2)
    })

    it('preserves additional data fields', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const conversation = world.addConversation(user, {
        content: 'Test',
        customField: 'customValue',
      })

      expect(conversation.data?.customField).toBe('customValue')
    })
  })

  describe('addResponse', () => {
    it('adds response to conversation', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const conversation = world.addConversation(user, { content: 'Question?' })
      const response = world.addResponse(conversation, { content: 'Answer!' })

      expect(response.type).toBe('response')
      expect(response.data?.content).toBe('Answer!')
      expect(response.data?.type).toBe('text')
      expect(response.meta.createdAt).toBeDefined()
      expect(conversation.children).toHaveLength(1)
    })

    it('adds multiple responses to same conversation', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const conversation = world.addConversation(user, { content: 'Question?' })
      world.addResponse(conversation, { content: 'First response' })
      world.addResponse(conversation, {
        content: 'Tool call result',
        type: 'tool_call',
      })

      expect(conversation.children).toHaveLength(2)
      expect(conversation.children[0].data?.type).toBe('text')
      expect(conversation.children[1].data?.type).toBe('tool_call')
    })

    it('preserves custom response type', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const conversation = world.addConversation(user, { content: 'Test' })
      const response = world.addResponse(conversation, {
        content: 'Tool result',
        type: 'tool_call',
      })

      expect(response.data?.type).toBe('tool_call')
    })
  })

  describe('getConversations', () => {
    it('returns empty array when no conversations', () => {
      const user = world.upsertUser({ userId: 'u1' })
      const conversations = world.getConversations(user)

      expect(conversations).toEqual([])
    })

    it('returns all conversations for user', () => {
      const user = world.upsertUser({ userId: 'u1' })
      world.addConversation(user, { content: 'First' })
      world.addConversation(user, { content: 'Second' })
      world.addConversation(user, { content: 'Third' })

      const conversations = world.getConversations(user)
      expect(conversations).toHaveLength(3)
    })
  })

  describe('full conversation flow', () => {
    it('creates user, adds conversation with responses', () => {
      const user = world.upsertUser({ userId: 'u1', sessionId: 's1' })
      const conversation = world.addConversation(user, {
        content: 'What is the weather?',
      })
      world.addResponse(conversation, {
        content: 'Checking weather...',
        type: 'tool_call',
      })
      world.addResponse(conversation, { content: 'The weather is sunny!' })

      expect(user.children).toHaveLength(2) // Sessions + Conversations
      const sessionsNode = user.children.find((c) => c.type === 'sessions')
      const conversationsNode = user.children.find(
        (c) => c.type === 'conversations',
      )

      expect(sessionsNode?.children).toHaveLength(1)
      expect(conversationsNode?.children).toHaveLength(1)
      expect(conversation.children).toHaveLength(2)
    })
  })
})

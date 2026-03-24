import { describe, it, expect, beforeEach } from 'vitest'
import { AgentWorld } from '../WorldsStore/AgentWorld'

describe('userOperations', () => {
  let world: AgentWorld

  beforeEach(() => {
    world = new AgentWorld('agent-1', 'user-1')
  })

  describe('upsertUser', () => {
    it('creates user with userId', () => {
      const user = world.upsertUser({ userId: 'u1', name: 'Alice' })
      expect(user.type).toBe('user')
      expect(user.data?.userId).toBe('u1')
      expect(user.data?.name).toBe('Alice')
    })

    it('creates user with sessionId and session in Sessions node', () => {
      const user = world.upsertUser({ sessionId: 's1' })
      expect(user.type).toBe('user')
      expect(user.children).toHaveLength(1)
      const sessionsNode = user.children[0]
      expect(sessionsNode.type).toBe('sessions')
      expect(sessionsNode.children).toHaveLength(1)
      expect(sessionsNode.children[0].type).toBe('session')
      expect(sessionsNode.children[0].id).toBe('s1')
    })

    it('creates Users node automatically', () => {
      world.upsertUser({ userId: 'u1' })
      const usersNode = world.findNode(world.root, 'users')
      expect(usersNode).not.toBeNull()
      expect(usersNode?.type).toBe('users')
    })

    it('updates existing user by userId', () => {
      world.upsertUser({ userId: 'u1', name: 'Alice' })
      const updated = world.upsertUser({ userId: 'u1', name: 'Alice Updated' })
      expect(updated.data?.name).toBe('Alice Updated')
      const usersNode = world.findNode(world.root, 'users')
      expect(usersNode?.children).toHaveLength(1)
    })

    it('updates existing anonymous user by sessionId', () => {
      world.upsertUser({ sessionId: 's1', name: 'Guest' })
      world.upsertUser({ sessionId: 's1', name: 'Guest Updated' })
      const usersNode = world.findNode(world.root, 'users')
      expect(usersNode?.children).toHaveLength(1)
      expect(usersNode?.children[0].data?.name).toBe('Guest Updated')
    })

    it('adds multiple sessions to same user in Sessions node', () => {
      world.upsertUser({ userId: 'u1', sessionId: 's1' })
      world.upsertUser({ userId: 'u1', sessionId: 's2' })
      const user = world.getUser('u1')
      const sessionsNode = user?.children.find((c) => c.type === 'sessions')
      expect(sessionsNode?.children).toHaveLength(2)
    })

    it('throws without userId or sessionId', () => {
      expect(() => world.upsertUser({ name: 'NoId' })).toThrow(
        'Either userId or sessionId must be provided',
      )
    })
  })

  describe('access control', () => {
    it('throws when accessing authorized user by session only', () => {
      // Create authorized user with session
      world.upsertUser({ userId: 'u1', sessionId: 's1', name: 'Alice' })

      // Try to access by session only - should fail
      expect(() =>
        world.upsertUser({ sessionId: 's1', name: 'Hacker' }),
      ).toThrow('Access denied: cannot access authorized user by session only')
    })

    it('allows accessing anonymous user by session', () => {
      // Create anonymous user with session
      world.upsertUser({ sessionId: 's1', name: 'Guest' })

      // Access by session - should work
      const user = world.upsertUser({ sessionId: 's1', name: 'Guest Updated' })
      expect(user.data?.name).toBe('Guest Updated')
    })

    it('throws when session belongs to another authorized user', () => {
      // Create authorized user with session
      world.upsertUser({ userId: 'u1', sessionId: 's1' })

      // Try to claim session with different userId
      expect(() => world.upsertUser({ userId: 'u2', sessionId: 's1' })).toThrow(
        'Access denied: session belongs to another authorized user',
      )
    })
  })

  describe('user merge on authorization', () => {
    it('merges anonymous user into authorized when both found', () => {
      // Create anonymous user with session and some data
      world.upsertUser({ sessionId: 's1', name: 'Guest', preferences: 'dark' })

      // Create authorized user separately
      world.upsertUser({ userId: 'u1', name: 'Alice' })

      // Now authorize with both - should merge
      const merged = world.upsertUser({ userId: 'u1', sessionId: 's1' })

      expect(merged.data?.userId).toBe('u1')
      expect(merged.data?.preferences).toBe('dark')
      const sessionsNode = merged.children.find((c) => c.type === 'sessions')
      expect(sessionsNode?.children.some((s) => s.id === 's1')).toBe(true)

      // Anonymous user should be deleted
      const usersNode = world.findNode(world.root, 'users')
      expect(usersNode?.children).toHaveLength(1)
    })

    it('authorizes anonymous user when only session found', () => {
      // Create anonymous user
      world.upsertUser({ sessionId: 's1', name: 'Guest' })

      // Authorize with new userId
      const user = world.upsertUser({ userId: 'u1', sessionId: 's1' })

      expect(user.data?.userId).toBe('u1')
      const sessionsNode = user.children.find((c) => c.type === 'sessions')
      expect(sessionsNode?.children[0].id).toBe('s1')

      const usersNode = world.findNode(world.root, 'users')
      expect(usersNode?.children).toHaveLength(1)
    })

    it('merges sessions from anonymous to authorized user', () => {
      // Anonymous user with multiple sessions
      world.upsertUser({ sessionId: 's1' })
      world.upsertUser({ sessionId: 's2' })

      // Authorized user
      world.upsertUser({ userId: 'u1', sessionId: 's3' })

      // Merge s1 user into authorized
      world.upsertUser({ userId: 'u1', sessionId: 's1' })

      const user = world.getUser('u1')
      const sessionsNode = user?.children.find((c) => c.type === 'sessions')
      expect(sessionsNode?.children).toHaveLength(2) // s3 and s1
    })
  })

  describe('getUser', () => {
    it('returns null for non-existent user', () => {
      expect(world.getUser('unknown')).toBeNull()
    })

    it('returns null when no Users node', () => {
      expect(world.getUser('u1')).toBeNull()
    })

    it('finds user by userId', () => {
      world.upsertUser({ userId: 'u1', name: 'Alice' })
      const user = world.getUser('u1')
      expect(user?.data?.userId).toBe('u1')
    })

    it('finds user by sessionId in Sessions node', () => {
      world.upsertUser({ sessionId: 's1' })
      const user = world.getUser(undefined, 's1')

      const sessionsNode = user?.children.find((c) => c.type === 'sessions')
      expect(sessionsNode?.children[0].id).toBe('s1')
    })
  })
})

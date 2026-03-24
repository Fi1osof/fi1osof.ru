import { describe, it, expect } from 'vitest'
import { AgentWorld } from '../WorldsStore/AgentWorld'

describe('AgentWorld', () => {
  describe('constructor', () => {
    it('creates world with correct id', () => {
      const world = new AgentWorld('agent-1', 'user-1')
      expect(world.id).toBe('agent-1:user-1')
      expect(world.agentId).toBe('agent-1')
      expect(world.ownerId).toBe('user-1')
    })

    it('creates world without ownerId', () => {
      const sharedWorld = new AgentWorld('agent-2')
      expect(sharedWorld.id).toBe('agent-2')
      expect(sharedWorld.ownerId).toBeUndefined()
    })

    it('has root node', () => {
      const world = new AgentWorld('agent-1')
      expect(world.root.id).toBe('root')
      expect(world.root.type).toBe('root')
      expect(world.root.children).toEqual([])
    })
  })
})

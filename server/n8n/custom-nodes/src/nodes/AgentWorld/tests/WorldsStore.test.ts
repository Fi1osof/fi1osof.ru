import { describe, it, expect, beforeEach } from 'vitest'
import { worldsStore } from '../WorldsStore'

describe('WorldsStore', () => {
  beforeEach(() => {
    // Note: worldsStore is a singleton, tests may affect each other
  })

  describe('getOrCreate', () => {
    it('creates new world', () => {
      const world = worldsStore.getOrCreate('test-agent', 'test-user')
      expect(world.agentId).toBe('test-agent')
      expect(world.ownerId).toBe('test-user')
    })

    it('returns existing world', () => {
      const world1 = worldsStore.getOrCreate('agent-x', 'user-x')
      const world2 = worldsStore.getOrCreate('agent-x', 'user-x')
      expect(world1).toBe(world2)
    })

    it('creates shared world without ownerId', () => {
      const world = worldsStore.getOrCreate('shared-agent')
      expect(world.id).toBe('shared-agent')
      expect(world.ownerId).toBeUndefined()
    })
  })

  describe('get', () => {
    it('returns undefined for non-existent', () => {
      expect(worldsStore.get('non-existent', 'user')).toBeUndefined()
    })

    it('returns existing world', () => {
      worldsStore.getOrCreate('get-test', 'user')
      expect(worldsStore.get('get-test', 'user')).toBeDefined()
    })
  })

  describe('getStats', () => {
    it('returns stats', () => {
      worldsStore.getOrCreate('stats-agent', 'user-1')
      worldsStore.getOrCreate('stats-agent', 'user-2')
      const stats = worldsStore.getStats()
      expect(stats.totalWorlds).toBeGreaterThanOrEqual(2)
      expect(stats.byAgent['stats-agent']).toBeGreaterThanOrEqual(2)
    })
  })
})

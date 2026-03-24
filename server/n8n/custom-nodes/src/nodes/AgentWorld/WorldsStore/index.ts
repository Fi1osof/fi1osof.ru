import { AgentWorld } from './AgentWorld'

class WorldsStore {
  private worlds: Map<string, AgentWorld> = new Map()

  private getWorldKey(agentId: string, ownerId?: string): string {
    return ownerId ? `${agentId}:${ownerId}` : agentId
  }

  getOrCreate(agentId: string, ownerId?: string): AgentWorld {
    const key = this.getWorldKey(agentId, ownerId)
    let world = this.worlds.get(key)

    if (!world) {
      world = new AgentWorld(agentId, ownerId)
      this.worlds.set(key, world)
    }

    return world
  }

  get(agentId: string, ownerId?: string): AgentWorld | undefined {
    const key = this.getWorldKey(agentId, ownerId)
    return this.worlds.get(key)
  }

  getStats(): {
    totalWorlds: number
    byAgent: Record<string, number>
  } {
    const byAgent: Record<string, number> = {}

    for (const world of this.worlds.values()) {
      byAgent[world.agentId] = (byAgent[world.agentId] || 0) + 1
    }

    return {
      totalWorlds: this.worlds.size,
      byAgent,
    }
  }
}

export const worldsStore = new WorldsStore()

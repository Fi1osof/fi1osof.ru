import { describe, it, expect, beforeEach } from 'vitest'
import { AgentWorld } from '../WorldsStore/AgentWorld'

describe('nodeRead', () => {
  let world: AgentWorld

  beforeEach(() => {
    world = new AgentWorld('agent-1', 'user-1')
  })

  describe('read', () => {
    it('compresses deep nodes', () => {
      const l1 = world.addNode('root', { type: 'a', name: 'L1', data: {} })
      const l2 = world.addNode(l1.id, { type: 'b', name: 'L2', data: {} })
      world.addNode(l2.id, { type: 'c', name: 'L3', data: {} })

      const view = world.read({ maxDepth: 2 })
      const l2View = view.children?.[0]?.children?.[0]
      expect(l2View?.children?.[0].type).toBe('compressed')
    })
  })

  describe('expandNode', () => {
    it('increases depthLevel', () => {
      const node = world.addNode('root', {
        type: 'task',
        name: 'Task',
        data: {},
      })
      const found = world.findNode(world.root, node.id)
      expect(found).not.toBeNull()
      const initialDepth = found?.meta.depthLevel ?? 0
      world.expandNode(node.id)
      const updated = world.findNode(world.root, node.id)
      expect(updated?.meta.depthLevel).toBe(initialDepth + 1)
    })
  })

  // describe('formatForContext', () => {
  //   it('formats tree as text', () => {
  //     world.addNode('root', {
  //       type: 'task',
  //       name: 'Task 1',
  //       data: { status: 'new' },
  //     })
  //     const text = world.formatForContext()
  //     expect(text).toContain('- World (root)')
  //     expect(text).toContain('  - Task 1 (task)')
  //     expect(text).toContain('status')
  //   })
  // })
})

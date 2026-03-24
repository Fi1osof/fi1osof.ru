import { describe, it, expect, beforeEach } from 'vitest'
import { AgentWorld } from '../WorldsStore/AgentWorld'

describe('nodeOperations', () => {
  let world: AgentWorld

  beforeEach(() => {
    world = new AgentWorld('agent-1', 'user-1')
  })

  describe('addNode', () => {
    it('adds node to root', () => {
      const node = world.addNode('root', {
        type: 'task',
        name: 'Task 1',
        data: {},
      })
      expect(node.id).toBeDefined()
      expect(node.type).toBe('task')
      expect(node.name).toBe('Task 1')
      expect(world.root.children).toHaveLength(1)
    })

    it('adds nested node', () => {
      const parent = world.addNode('root', {
        type: 'folder',
        name: 'Tasks',
        data: {},
      })
      const child = world.addNode(parent.id, {
        type: 'task',
        name: 'Task 1',
        data: {},
      })
      expect(world.findNode(world.root, child.id)).toBeTruthy()
    })

    it('throws on invalid parent', () => {
      expect(() =>
        world.addNode('invalid', { type: 'task', name: 'X', data: {} }),
      ).toThrow('Parent node "invalid" not found')
    })
  })

  describe('updateNode', () => {
    it('updates node name and data', () => {
      const node = world.addNode('root', {
        type: 'task',
        name: 'Old',
        data: { status: 'new' },
      })
      const updated = world.updateNode(node.id, {
        name: 'New',
        data: { status: 'done' },
      })
      expect(updated.name).toBe('New')
      expect(updated.data?.status).toBe('done')
    })

    it('throws on invalid node', () => {
      expect(() => world.updateNode('invalid', { name: 'X' })).toThrow(
        'Node "invalid" not found',
      )
    })
  })

  describe('deleteNode', () => {
    it('deletes node', () => {
      const node = world.addNode('root', {
        type: 'task',
        name: 'Task',
        data: {},
      })
      world.deleteNode(node.id)
      expect(world.root.children).toHaveLength(0)
    })

    it('throws on root delete', () => {
      expect(() => world.deleteNode('root')).toThrow('Cannot delete root node')
    })
  })

  describe('moveNode', () => {
    it('moves node to new parent', () => {
      const folder1 = world.addNode('root', {
        type: 'folder',
        name: 'F1',
        data: {},
      })
      const folder2 = world.addNode('root', {
        type: 'folder',
        name: 'F2',
        data: {},
      })
      const task = world.addNode(folder1.id, {
        type: 'task',
        name: 'Task',
        data: {},
      })

      world.moveNode(task.id, folder2.id)

      expect(world.findNode(world.root, folder1.id)?.children).toHaveLength(0)
      expect(world.findNode(world.root, folder2.id)?.children).toHaveLength(1)
    })

    it('throws on cycle', () => {
      const parent = world.addNode('root', {
        type: 'folder',
        name: 'Parent',
        data: {},
      })
      const child = world.addNode(parent.id, {
        type: 'folder',
        name: 'Child',
        data: {},
      })
      expect(() => world.moveNode(parent.id, child.id)).toThrow(
        'create a cycle',
      )
    })
  })
})

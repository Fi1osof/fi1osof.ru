import { WorldNode, WorldData, createMeta } from '../../../interfaces'
import * as crypto from 'crypto'
import { findNode, findParentNode, isDescendant } from './nodeTraversal'

function generateNodeId(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase()
}

export function addNode(
  data: WorldData,
  parentId: string,
  node: Omit<WorldNode, 'id' | 'meta' | 'children'>,
): WorldNode {
  const parent = findNode(data.root, parentId)

  if (!parent) {
    throw new Error(
      `Parent node "${parentId}" not found. Use "root" to add to root node.`,
    )
  }

  const newNode: WorldNode = {
    id: generateNodeId(),
    ...node,
    meta: createMeta(),
    children: [],
  }

  parent.children.push(newNode)
  parent.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()

  return newNode
}

export function updateNode(
  data: WorldData,
  nodeId: string,
  updates: Partial<Pick<WorldNode, 'name' | 'data'>>,
): WorldNode {
  const node = findNode(data.root, nodeId)
  if (!node) {
    throw new Error(`Node "${nodeId}" not found in world.`)
  }

  if (updates.name !== undefined) {
    node.name = updates.name
  }
  if (updates.data !== undefined) {
    node.data = { ...node.data, ...updates.data }
  }

  node.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()

  return node
}

export function deleteNode(data: WorldData, nodeId: string): void {
  if (nodeId === 'root') {
    throw new Error('Cannot delete root node.')
  }

  const parent = findParentNode(data.root, nodeId)
  if (!parent) {
    throw new Error(`Node "${nodeId}" not found in world.`)
  }

  const index = parent.children.findIndex((child) => child.id === nodeId)
  if (index === -1) {
    throw new Error(`Node "${nodeId}" not found in parent's children.`)
  }

  parent.children.splice(index, 1)
  parent.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()
}

export function moveNode(
  data: WorldData,
  nodeId: string,
  newParentId: string,
): WorldNode {
  if (nodeId === 'root') {
    throw new Error('Cannot move root node.')
  }

  if (nodeId === newParentId) {
    throw new Error('Cannot move node into itself.')
  }

  const node = findNode(data.root, nodeId)
  if (!node) {
    throw new Error(`Node "${nodeId}" not found in world.`)
  }

  const newParent = findNode(data.root, newParentId)
  if (!newParent) {
    throw new Error(`Target parent node "${newParentId}" not found.`)
  }

  if (isDescendant(node, newParentId)) {
    throw new Error(
      `Cannot move node "${nodeId}" into its descendant "${newParentId}". This would create a cycle.`,
    )
  }

  const oldParent = findParentNode(data.root, nodeId)
  if (!oldParent) {
    throw new Error(`Parent of node "${nodeId}" not found.`)
  }

  const index = oldParent.children.findIndex((child) => child.id === nodeId)
  oldParent.children.splice(index, 1)
  oldParent.meta.updatedAt = new Date().toISOString()

  newParent.children.push(node)
  newParent.meta.updatedAt = new Date().toISOString()
  node.meta.updatedAt = new Date().toISOString()
  data.updatedAt = new Date().toISOString()

  return node
}

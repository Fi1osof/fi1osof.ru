import { WorldNode } from '../../../interfaces'

export function findNode(root: WorldNode, nodeId: string): WorldNode | null {
  if (root.id === nodeId) {
    return root
  }

  for (const child of root.children) {
    const found = findNode(child, nodeId)
    if (found) {
      return found
    }
  }

  return null
}

export function findParentNode(
  root: WorldNode,
  nodeId: string,
): WorldNode | null {
  for (const child of root.children) {
    if (child.id === nodeId) {
      return root
    }
    const found = findParentNode(child, nodeId)
    if (found) {
      return found
    }
  }
  return null
}

export function isDescendant(node: WorldNode, targetId: string): boolean {
  for (const child of node.children) {
    if (child.id === targetId) {
      return true
    }
    if (isDescendant(child, targetId)) {
      return true
    }
  }
  return false
}

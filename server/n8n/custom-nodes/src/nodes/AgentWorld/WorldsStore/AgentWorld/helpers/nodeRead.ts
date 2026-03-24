import { WorldNode, ReadOptions, WorldNodeRead } from '../../../interfaces'
import { findNode } from './nodeTraversal'

export function readNodeRecursive(
  node: WorldNode,
  currentDepth: number,
  maxDepth: number,
  expandNodeIds: string[],
): WorldNodeRead {
  const now = new Date().toISOString()
  node.meta.lastReadAt = now
  node.meta.readCount++

  // Increase depthLevel on frequent reads
  if (node.meta.readCount > 5 && node.meta.depthLevel < 5) {
    node.meta.depthLevel++
  }

  const effectiveMaxDepth = expandNodeIds.includes(node.id)
    ? maxDepth + node.meta.depthLevel
    : maxDepth

  let children: WorldNodeRead[]

  if (currentDepth >= effectiveMaxDepth) {
    children =
      node.children.length > 0
        ? [
            {
              id: '__compressed__',
              type: 'compressed',
              // name: `[${node.children.length} items]`,
              name: undefined,
              data: undefined,
              // meta: createMeta(),
              meta: undefined,
              createdAt: undefined,
              children: [],
            },
          ]
        : []
  } else {
    children = node.children.map((child) =>
      readNodeRecursive(
        child,
        currentDepth + 1,
        effectiveMaxDepth,
        expandNodeIds,
      ),
    )
  }

  return {
    ...node,
    data:
      node.data && Object.keys(node.data).length > 0 ? node.data : undefined,
    meta: undefined,
    createdAt: node.meta.createdAt,
    children: children.length > 0 ? children : undefined,
  }
}

export function readWorld(
  root: WorldNode,
  options: ReadOptions = {},
): WorldNodeRead {
  const { maxDepth = 2, expandNodeIds = [] } = options
  return readNodeRecursive(root, 0, maxDepth, expandNodeIds)
}

export function expandNode(
  root: WorldNode,
  nodeId: string,
  depth: number = 3,
): WorldNodeRead {
  const node = findNode(root, nodeId)
  if (!node) {
    throw new Error(`Node "${nodeId}" not found in world.`)
  }

  node.meta.depthLevel = Math.min(node.meta.depthLevel + 1, 10)

  return readNodeRecursive(node, 0, depth, [])
}

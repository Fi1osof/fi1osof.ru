export interface WorldNodeMeta {
  createdAt: string
  updatedAt: string
  lastReadAt: string
  readCount: number
  depthLevel: number // nesting level when reading
}

export interface WorldNode {
  id: string
  // 'task' | 'user' | 'article' | etc.
  type: string | undefined
  name: string | null | undefined
  data: Record<string, unknown> | undefined
  meta: WorldNodeMeta
  children: WorldNode[]
}

export interface WorldData {
  id: string
  agentId: string
  ownerId?: string // for "separate world per interlocutor" mode
  root: WorldNode
  createdAt: string
  updatedAt: string
}

export type WorldNodeRead = Omit<WorldNode, 'meta' | 'children' | 'data'> & {
  createdAt: WorldNodeMeta['createdAt'] | undefined
  children: WorldNodeRead[] | undefined
  data: WorldNode['data'] | undefined
  meta: undefined
}

export interface ReadOptions {
  maxDepth?: number
  expandNodeIds?: string[] // nodes that need to be expanded deeper
}

export function createMeta(): WorldNodeMeta {
  const now = new Date().toISOString()
  return {
    createdAt: now,
    updatedAt: now,
    lastReadAt: now,
    readCount: 0,
    depthLevel: 1,
  }
}

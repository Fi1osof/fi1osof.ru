export interface WorldNodeData {
  id: string
  type: string
  properties: Record<string, unknown>
}

export interface WorldReadResult {
  id: string
  type: string
  properties: Record<string, unknown>
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  children: WorldReadResult[]
}

export interface World3dObjectCreateParams {
  nodeId?: string
  parentId?: string
  type: string
  properties?: Record<string, unknown>
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
}

export interface World3dObjectUpdateParams {
  nodeId: string
  type?: string
  properties?: Record<string, unknown>
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
}

export interface World3dObjectDeleteParams {
  nodeId: string
  cascade?: boolean
}

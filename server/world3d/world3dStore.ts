/**
 * @deprecated !!!
 */

import * as THREE from 'three'
import * as fs from 'fs'
import * as path from 'path'
import {
  World3dObjectCreateParams,
  World3dObjectDeleteParams,
  World3dObjectUpdateParams,
  WorldNodeData,
  WorldReadResult,
} from './interfaces'

const WORLDS_STORAGE_DIR = path.resolve(process.cwd(), './storage/world3d')
const WORLDS_STORAGE_WORLDS_DIR = path.resolve(WORLDS_STORAGE_DIR, 'worlds')

const DEFAULT_WORLD_NAME = 'main'
const WORLD_FILE = 'world.json'
const TEMPLATE_FILE = 'template.json'
const SNAPSHOTS_DIR = 'snapshots'
const SNAPSHOT_PATH_FORMAT = process.env.WORLD3D_SNAPSHOT_PATH_FORMAT || 'Y/M/D'

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function getTimestamp(): string {
  const now = Date.now()
  return now.toString()
}

function getWorldDir(worldName: string): string {
  return path.join(WORLDS_STORAGE_WORLDS_DIR, worldName)
}

function getWorldFilePath(worldName: string): string {
  return path.join(getWorldDir(worldName), WORLD_FILE)
}

function getTemplateFilePath(worldName: string): string {
  return path.join(getWorldDir(worldName), TEMPLATE_FILE)
}

function getSnapshotsDir(worldName: string): string {
  return path.join(getWorldDir(worldName), SNAPSHOTS_DIR)
}

function getSnapshotSubDir(worldName: string): string {
  const now = new Date()
  const replacements: Record<string, string> = {
    Y: now.getFullYear().toString(),
    M: String(now.getMonth() + 1).padStart(2, '0'),
    D: String(now.getDate()).padStart(2, '0'),
    H: String(now.getHours()).padStart(2, '0'),
  }
  const subPath = SNAPSHOT_PATH_FORMAT.split('/')
    .map((p) => replacements[p] || p)
    .join(path.sep)
  return path.join(getSnapshotsDir(worldName), subPath)
}

function ensureDirectories(worldName: string): void {
  const worldDir = getWorldDir(worldName)
  if (!fs.existsSync(worldDir)) {
    fs.mkdirSync(worldDir, { recursive: true })
  }
  const snapshotsDir = getSnapshotsDir(worldName)
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true })
  }
}

class World3DStore {
  private scene: THREE.Scene
  private nodeDataMap: Map<string, WorldNodeData> = new Map()
  private initialized = false
  private worldName: string = DEFAULT_WORLD_NAME

  constructor() {
    this.scene = new THREE.Scene()
    this.scene.name = 'root'
    this.scene.userData = { id: 'root', type: 'root', properties: {} }
    this.nodeDataMap.set('root', {
      id: 'root',
      type: 'root',
      properties: {},
    })
  }

  async initialize(worldName: string = DEFAULT_WORLD_NAME): Promise<void> {
    if (this.initialized) {
      return
    }

    this.worldName = worldName
    ensureDirectories(this.worldName)
    await this.loadWorld()
    this.initialized = true
  }

  private async loadWorld(): Promise<void> {
    const worldFilePath = getWorldFilePath(this.worldName)
    const templateFilePath = getTemplateFilePath(this.worldName)

    let dataPath: string

    if (fs.existsSync(worldFilePath)) {
      dataPath = worldFilePath
    } else if (fs.existsSync(templateFilePath)) {
      fs.copyFileSync(templateFilePath, worldFilePath)
      dataPath = worldFilePath
    } else {
      throw new Error(
        `[World3D] Neither world.json nor template.json found for world "${this.worldName}"`,
      )
    }

    try {
      const content = fs.readFileSync(dataPath, 'utf-8')
      const data = JSON.parse(content)

      if (data.scene && data.nodeDataMap) {
        const loader = new THREE.ObjectLoader()
        const loadedScene = loader.parse(data.scene)

        this.scene.clear()
        for (const child of loadedScene.children) {
          this.scene.add(child)
        }

        this.nodeDataMap.clear()
        for (const [id, nodeData] of Object.entries(data.nodeDataMap)) {
          this.nodeDataMap.set(id, nodeData as WorldNodeData)
        }

        this.nodeDataMap.set('root', {
          id: 'root',
          type: 'root',
          properties: {},
        })
      }
    } catch (error) {
      console.error('[World3D] Failed to load world:', error)
      throw error
    }
  }

  private saveWorld(): void {
    ensureDirectories(this.worldName)
    const worldFilePath = getWorldFilePath(this.worldName)
    const data = {
      metadata: {
        version: '1.0.0',
        name: this.worldName,
        savedAt: new Date().toISOString(),
      },
      scene: this.scene.toJSON(),
      nodeDataMap: Object.fromEntries(this.nodeDataMap),
    }
    fs.writeFileSync(worldFilePath, JSON.stringify(data, null, 2))
  }

  private saveSnapshot(timestamp: string): void {
    const snapshotDir = getSnapshotSubDir(this.worldName)
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true })
    }
    const snapshotPath = path.join(snapshotDir, `${timestamp}.json`)
    const data = {
      metadata: {
        version: '1.0.0',
        name: this.worldName,
        snapshotAt: new Date().toISOString(),
      },
      scene: this.scene.toJSON(),
      nodeDataMap: Object.fromEntries(this.nodeDataMap),
    }
    fs.writeFileSync(snapshotPath, JSON.stringify(data, null, 2))
  }

  private findObjectById(id: string): THREE.Object3D | null {
    if (id === 'root') {
      return this.scene
    }

    let found: THREE.Object3D | null = null
    this.scene.traverse((obj) => {
      if (obj.userData?.id === id) {
        found = obj
      }
    })
    return found
  }

  read(
    nodeId: string = 'root',
    depth: number = 1,
    detailed: boolean = false,
  ): WorldReadResult | null {
    const obj = this.findObjectById(nodeId)
    if (!obj) {
      return null
    }

    return this.objectToResult(obj, detailed, depth)
  }

  private objectToResult(
    obj: THREE.Object3D,
    detailed: boolean = false,
    depth: number = 1,
  ): WorldReadResult {
    const nodeData = this.nodeDataMap.get(obj.userData?.id || 'unknown')

    const result: WorldReadResult = {
      id: obj.userData?.id || obj.name || 'unknown',
      type: nodeData?.type || 'Object3D',
      properties: detailed ? nodeData?.properties || {} : {},
      position: {
        x: obj.position.x,
        y: obj.position.y,
        z: obj.position.z,
      },
      rotation: {
        x: obj.rotation.x,
        y: obj.rotation.y,
        z: obj.rotation.z,
      },
      scale: {
        x: obj.scale.x,
        y: obj.scale.y,
        z: obj.scale.z,
      },
      children: [],
    }

    if (depth > 1) {
      for (const child of obj.children) {
        result.children.push(this.objectToResult(child, detailed, depth - 1))
      }
    }

    return result
  }

  create(params: World3dObjectCreateParams): object {
    const timestamp = getTimestamp()
    this.saveSnapshot(timestamp)

    const {
      nodeId,
      parentId = 'root',
      type,
      properties = {},
      position,
      rotation,
      scale,
    } = params

    const id = nodeId || generateId()

    const existing = this.findObjectById(id)
    if (existing) {
      return {
        success: false,
        nodeId: id,
        error: `Node ${id} already exists`,
      }
    }

    const obj = new THREE.Object3D()
    obj.name = id
    obj.userData = { id, type, properties }

    this.nodeDataMap.set(id, { id, type, properties })

    const parent = this.findObjectById(parentId)
    if (!parent) {
      return {
        success: false,
        nodeId: id,
        error: `Parent ${parentId} not found`,
      }
    }
    parent.add(obj)

    if (position) {
      obj.position.set(position.x, position.y, position.z)
    }
    if (rotation) {
      obj.rotation.set(rotation.x, rotation.y, rotation.z)
    }
    if (scale) {
      obj.scale.set(scale.x, scale.y, scale.z)
    }

    this.saveWorld()

    return this.objectToResult(obj, true)
  }

  update(params: World3dObjectUpdateParams): object {
    const timestamp = getTimestamp()
    this.saveSnapshot(timestamp)

    const { nodeId, type, properties, position, rotation, scale } = params

    const obj = this.findObjectById(nodeId)
    if (!obj) {
      return {
        success: false,
        nodeId: nodeId,
        error: `Node ${nodeId} not found`,
      }
    }

    const nodeData = this.nodeDataMap.get(nodeId)
    if (nodeData) {
      if (type !== undefined) {
        nodeData.type = type
      }
      if (properties !== undefined) {
        nodeData.properties = { ...nodeData.properties, ...properties }
      }
    }

    if (position) {
      obj.position.set(position.x, position.y, position.z)
    }
    if (rotation) {
      obj.rotation.set(rotation.x, rotation.y, rotation.z)
    }
    if (scale) {
      obj.scale.set(scale.x, scale.y, scale.z)
    }

    this.saveWorld()

    return this.objectToResult(obj, true)
  }

  delete(params: World3dObjectDeleteParams): boolean {
    const { nodeId, cascade = false } = params

    if (nodeId === 'root') {
      throw new Error('Cannot delete root node')
    }

    const timestamp = getTimestamp()
    this.saveSnapshot(timestamp)

    const obj = this.findObjectById(nodeId)
    if (!obj) {
      throw new Error(`Node ${nodeId} not found`)
    }

    if (!cascade && obj.children.length > 0) {
      throw new Error(
        `Node ${nodeId} has children. Use cascade=true to delete with children`,
      )
    }

    const idsToRemove: string[] = []
    if (cascade) {
      obj.traverse((child) => {
        if (child.userData?.id) {
          idsToRemove.push(child.userData.id)
        }
      })
    } else {
      idsToRemove.push(nodeId)
    }

    obj.removeFromParent()

    for (const id of idsToRemove) {
      this.nodeDataMap.delete(id)
    }

    this.saveWorld()

    return true
  }

  getStats(): {
    worldName: string
    nodeCount: number
    snapshotCount: number
  } {
    let nodeCount = 0
    this.scene.traverse(() => {
      nodeCount++
    })

    const snapshotsDir = getSnapshotsDir(this.worldName)
    let snapshotCount = 0
    if (fs.existsSync(snapshotsDir)) {
      snapshotCount = fs
        .readdirSync(snapshotsDir)
        .filter((f) => f.endsWith('.json')).length
    }

    return { worldName: this.worldName, nodeCount, snapshotCount }
  }
}

export const world3dStore = new World3DStore()

export async function initializeWorld3D(
  worldName: string = DEFAULT_WORLD_NAME,
): Promise<void> {
  await world3dStore.initialize(worldName)
}

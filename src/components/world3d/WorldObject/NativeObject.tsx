'use client'

import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { Matrix4, ObjectLoader } from 'three'
import type { Object3D } from 'three'
import type { WorldObject3d } from '../hooks/useWorldStore'
import { WorldObject } from './index'

interface NativeObjectProps {
  object: WorldObject3d
}

interface GeometryEntry {
  uuid: string
  type: string
  [key: string]: unknown
}

interface MaterialEntry {
  uuid: string
  type: string
  [key: string]: unknown
}

interface TransformProps {
  matrix?: Matrix4
  matrixAutoUpdate?: boolean
}

interface ThreeJsJson {
  metadata: {
    version: number
    type: string
    generator: string
  }
  geometries: GeometryEntry[]
  materials: MaterialEntry[]
  object: Record<string, unknown>
}

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function normalizeColorValue(color: unknown): unknown {
  if (typeof color !== 'string') {
    return color
  }

  const normalized = color.trim()
  if (!normalized.startsWith('#')) {
    return color
  }

  const parsed = Number.parseInt(normalized.slice(1), 16)
  return Number.isNaN(parsed) ? color : parsed
}

function normalizeMaterialEntry(material: MaterialEntry): MaterialEntry {
  return {
    ...material,
    color: normalizeColorValue(material.color),
    emissive: normalizeColorValue(material.emissive),
    specular: normalizeColorValue(material.specular),
  }
}

function getTransformProps(object: WorldObject3d): TransformProps {
  const matrixValues = Array.isArray(object.matrix) ? object.matrix : null

  if (!matrixValues || matrixValues.length !== 16) {
    return {
      matrixAutoUpdate: object.matrixAutoUpdate === false ? false : undefined,
    }
  }

  return {
    matrix: new Matrix4().fromArray(matrixValues),
    matrixAutoUpdate: false,
  }
}

function getObjectProperties(object: WorldObject3d): Record<string, unknown> {
  const userData = object.userData as { properties?: unknown } | undefined
  return userData?.properties && typeof userData.properties === 'object'
    ? (userData.properties as Record<string, unknown>)
    : {}
}

function getObjectUserData(object: WorldObject3d): Record<string, unknown> {
  return object.userData && typeof object.userData === 'object'
    ? (object.userData as Record<string, unknown>)
    : {}
}

function getObjectMatrixPosition(object: WorldObject3d): {
  x: number
  y: number
  z: number
} {
  const matrixValues = Array.isArray(object.matrix) ? object.matrix : null

  if (!matrixValues || matrixValues.length !== 16) {
    return { x: 0, y: 0, z: 0 }
  }

  return {
    x: matrixValues[12] ?? 0,
    y: matrixValues[13] ?? 0,
    z: matrixValues[14] ?? 0,
  }
}

function getBoxGeometrySize(object: WorldObject3d): {
  width: number
  height: number
  depth: number
} | null {
  const geometry =
    object.geometry && typeof object.geometry === 'object'
      ? (object.geometry as Record<string, unknown>)
      : null

  if (!geometry || geometry.type !== 'BoxGeometry') {
    return null
  }

  const width = typeof geometry.width === 'number' ? geometry.width : null
  const height = typeof geometry.height === 'number' ? geometry.height : null
  const depth = typeof geometry.depth === 'number' ? geometry.depth : null

  if (width === null || height === null || depth === null) {
    return null
  }

  return { width, height, depth }
}

function getColumnLabel(object: WorldObject3d): string | null {
  const userData = getObjectUserData(object)
  const label = userData.label
  return typeof label === 'string' && label.trim() ? label.trim() : null
}

function getCardTitle(object: WorldObject3d): string | null {
  const userData = getObjectUserData(object)
  const properties = getObjectProperties(object)

  const candidates = [
    userData.title,
    properties.label,
    properties.name,
    object.name,
  ]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return null
}

function isTaskCardObject(object: WorldObject3d): boolean {
  const userData = getObjectUserData(object)
  return typeof userData.taskId === 'string' && userData.taskId.length > 0
}

function getColumnHeaderOffsetY(children: WorldObject3d[]): number {
  if (children.length === 0) {
    return 1.2
  }

  const maxY = children.reduce((acc, child) => {
    const position = getObjectMatrixPosition(child)
    const size = getBoxGeometrySize(child)
    const top = position.y + (size?.height ?? 0) / 2
    return Math.max(acc, top)
  }, Number.NEGATIVE_INFINITY)

  return Number.isFinite(maxY) ? maxY + 0.9 : 1.2
}

const boardTextColor = '#111827'
const boardTextOutlineColor = '#ffffff'

function convertToThreeJsFormat(object: WorldObject3d): ThreeJsJson {
  const geometries: ThreeJsJson['geometries'] = []
  const materials: ThreeJsJson['materials'] = []

  function processObject(obj: WorldObject3d): Record<string, unknown> {
    const result: Record<string, unknown> = { ...obj }

    if (obj.geometry && typeof obj.geometry === 'object') {
      const geomDef = obj.geometry as GeometryEntry
      const geomUuid = generateUuid()
      geometries.push({
        ...geomDef,
        uuid: geomUuid,
      })
      result.geometry = geomUuid
    }

    if (obj.material && typeof obj.material === 'object') {
      const matDef = obj.material as MaterialEntry
      const matUuid = generateUuid()
      materials.push({
        ...normalizeMaterialEntry(matDef),
        uuid: matUuid,
      })
      result.material = matUuid
    }

    if (Array.isArray(obj.children)) {
      result.children = obj.children.map(processObject)
    }

    return result
  }

  const processedObject = processObject(object)

  return {
    metadata: {
      version: 4.5,
      type: 'Object',
      generator: 'WorldObject',
    },
    geometries,
    materials,
    object: processedObject,
  }
}

const objectLoader = new ObjectLoader()

function parseNativeObject(object: WorldObject3d): Object3D | null {
  if (!object.type) {
    return null
  }

  const threeJsJson = convertToThreeJsFormat(object)
  return objectLoader.parse(threeJsJson)
}

function getObjectKey(object: WorldObject3d, index: number): string {
  return object.uuid ?? `world-object-${index}`
}

export const NativeObject: React.FC<NativeObjectProps> = ({ object }) => {
  const objectType = object.type

  const children = object.children

  const nativeObject = useMemo(() => parseNativeObject(object), [object])
  const transformProps = useMemo(() => getTransformProps(object), [object])
  const columnLabel = useMemo(() => getColumnLabel(object), [object])
  const cardTitle = useMemo(() => getCardTitle(object), [object])
  const boxGeometrySize = useMemo(() => getBoxGeometrySize(object), [object])
  const columnHeaderOffsetY = useMemo(
    () => (children ? getColumnHeaderOffsetY(children) : 0),
    [children],
  )

  if (objectType === 'Scene') {
    return (
      <>
        {children?.map((child, index) => (
          <WorldObject key={getObjectKey(child, index)} object={child} />
        ))}
      </>
    )
  }

  if (objectType === 'Group') {
    return (
      <group {...transformProps}>
        {columnLabel && (
          <Text
            anchorX="center"
            anchorY="middle"
            color={boardTextColor}
            fontSize={0.45}
            maxWidth={5.5}
            outlineColor={boardTextOutlineColor}
            outlineWidth={0.03}
            position={[0, columnHeaderOffsetY, 0.08]}
          >
            {columnLabel}
          </Text>
        )}
        {children?.map((child, index) => (
          <WorldObject key={getObjectKey(child, index)} object={child} />
        ))}
      </group>
    )
  }

  if (!nativeObject) {
    return null
  }

  if (isTaskCardObject(object) && cardTitle && boxGeometrySize) {
    return (
      <primitive object={nativeObject}>
        <Text
          anchorX="center"
          anchorY="middle"
          color={boardTextColor}
          fontSize={0.22}
          maxWidth={Math.max(boxGeometrySize.width - 0.4, 1)}
          outlineColor={boardTextOutlineColor}
          outlineWidth={0.02}
          overflowWrap="break-word"
          position={[0, 0, boxGeometrySize.depth / 2 + 0.01]}
        >
          {cardTitle}
        </Text>
      </primitive>
    )
  }

  return <primitive object={nativeObject} />
}

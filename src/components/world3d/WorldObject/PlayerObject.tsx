'use client'

import { useMemo } from 'react'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import type { Vector3Tuple } from 'three'
import { Avatar } from '../Avatar'
import type { WorldObject3d } from '../hooks/useWorldStore'
import type { AnimationName } from '../hooks/useMultiplayer/interfaces'
import { WorldObject } from './index'

interface PlayerObjectProps {
  object: WorldObject3d
}

function toVec3Tuple(v: { x: number; y: number; z: number }): Vector3Tuple {
  return [v.x, v.y, v.z]
}

function getObjectProperties(object: WorldObject3d): Record<string, unknown> {
  const userData = object.userData as { properties?: unknown } | undefined
  return userData?.properties && typeof userData.properties === 'object'
    ? (userData.properties as Record<string, unknown>)
    : {}
}

function isLocalPlayerObject(object: WorldObject3d): boolean {
  const userData = object.userData as { isLocalPlayer?: unknown } | undefined
  return userData?.isLocalPlayer === true
}

function getObjectKey(object: WorldObject3d, index: number): string {
  return object.uuid ?? `world-object-${index}`
}

export const PlayerObject: React.FC<PlayerObjectProps> = ({ object }) => {
  const { position, quaternion } = useMemo(() => {
    const matrix = new Matrix4()
    const quaternion = new Quaternion()
    const position = new Vector3()
    const scale = new Vector3(1, 1, 1)
    const rotation = new Euler()
    const matrixValues = Array.isArray(object.matrix) ? object.matrix : null

    if (matrixValues && matrixValues.length === 16) {
      matrix.fromArray(matrixValues)
      matrix.decompose(position, quaternion, scale)
      rotation.setFromQuaternion(quaternion)
    }

    return {
      position: toVec3Tuple(position),
      quaternion,
    }
  }, [object])

  const children = Array.isArray(object.children) ? object.children : []

  if (isLocalPlayerObject(object)) {
    return (
      <>
        {children.map((child, index) => (
          <WorldObject key={getObjectKey(child, index)} object={child} />
        ))}
      </>
    )
  }

  const props = getObjectProperties(object)
  const animation =
    typeof props.animation === 'string'
      ? (props.animation as AnimationName)
      : 'idle'

  return (
    <group position={position} quaternion={quaternion}>
      <Avatar animation={animation} />
    </group>
  )
}

'use client'

import React, { useRef } from 'react'
import * as THREE from 'three'
import { PerspectiveCamera } from '@react-three/drei'
import type { PerspectiveCamera as PerspectiveCameraType } from 'three'

const CAMERA_DISTANCE = 6 // Camera distance from pivot
const PIVOT_HEIGHT = 1.7 // Pivot height (approximately head)

interface ThirdPersonCameraProps {
  pitch: number // Vertical camera angle (controlled from Player)
  yaw?: number // Horizontal camera angle relative to avatar
}

/**
 * Third person camera component — child of RigidBody with fixed offset.
 * Camera orbits around player vertically (pitch).
 * Horizontal rotation is controlled via rotationRef in Player (avatar rotates).
 *
 * Structure:
 * - pivotRef (group) — rotation point at player head level
 * - cameraRef (PerspectiveCamera) — camera with backward offset from pivot
 */
export const ThirdPersonCamera: React.FC<ThirdPersonCameraProps> = ({
  pitch,
  yaw = 0,
}) => {
  const pivotRef = useRef<THREE.Group>(null)
  const cameraRef = useRef<PerspectiveCameraType>(null)

  return (
    // Yaw group — horizontal camera rotation relative to avatar
    <group rotation={[0, yaw, 0]}>
      {/* Pivot group at head level — vertical tilt (pitch) */}
      <group
        ref={pivotRef}
        position={[0, PIVOT_HEIGHT, 0]}
        rotation={[pitch, 0, 0]}
      >
        {/* Camera with backward offset from pivot */}
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0, -CAMERA_DISTANCE]}
          rotation={[0, Math.PI, 0]} // Looks at pivot (at player)
        />
      </group>
    </group>
  )
}

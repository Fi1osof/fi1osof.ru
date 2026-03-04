'use client'

import { useEffect, useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

interface GroundProps {
  onReady?: () => void
}

export const Ground: React.FC<GroundProps> = ({ onReady }) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const hasCalledOnReady = useRef(false)

  useEffect(() => {
    if (rigidBodyRef.current && !hasCalledOnReady.current) {
      hasCalledOnReady.current = true
      onReady?.()
    }
  })

  return (
    <RigidBody ref={rigidBodyRef} type="fixed" colliders="cuboid">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#3a7d44" />
      </mesh>
    </RigidBody>
  )
}

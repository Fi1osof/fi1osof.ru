'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { Vector3, Quaternion, Group, AudioListener, Matrix4 } from 'three'
import type { WorldObject3d } from '../hooks/useWorldStore'
import type { RapierRigidBody } from '@react-three/rapier'
import { ThirdPersonCamera } from '../ThirdPersonCamera'
import { Avatar } from '../Avatar'
import { usePlayerReducer } from './hooks/usePlayerReducer'
import { AnimationName } from './interfaces'
import type { LocalPlayerState, SelfStateData } from '../hooks/useMultiplayer'
import { DebugCapsuleGeometry } from '../components/debug/DebugCapsuleGeometry'
import { DebugAvatarGeometry } from '../components/debug/DebugAvatarGeometry'
import { DebugOverlay } from '../components/debug/DebugOverlay'
import { useAppContext } from 'src/components/AppContext'

const TURN_SPEED = 2.5 // Turn speed (radians/sec)
const MOUSE_SENSITIVITY = 0.005
const MIN_PITCH = -Math.PI / 6 // Minimum pitch (looking up)
const MAX_PITCH = Math.PI / 3 // Maximum pitch (looking down)

// Base speeds from animation analysis (units/sec)
const WALK_SPEED = 3.5248
const RUN_SPEED = 11.6508
const JUMP_FORCE = 5

/** Default spawn position for unauthenticated users */
const DEFAULT_SPAWN_POSITION: [number, number, number] = [0, 2, -10]
const DEFAULT_SPAWN_ROTATION: [number, number, number] = [0, 0, 0]

/** Extract position from 4x4 matrix (column-major) */
function extractPositionFromMatrix(matrix: number[]): [number, number, number] {
  return [matrix[12], matrix[13], matrix[14]]
}

/** Extract Y rotation (yaw) from 4x4 matrix (column-major) */
function extractYawFromMatrix(matrix: number[]): number {
  const m = new Matrix4()
  m.fromArray(matrix)
  const q = new Quaternion()
  q.setFromRotationMatrix(m)
  return Math.atan2(
    2 * (q.w * q.y + q.x * q.z),
    1 - 2 * (q.y * q.y + q.z * q.z),
  )
}

type PlayerProps = {
  debug: boolean
  /** Callback to send local player state to multiplayer server (called every frame, internally throttled) */
  sendPlayerState?: (state: LocalPlayerState) => void
  /** Ref to expose the AudioListener instance for external control (e.g. world mute) */
  audioListenerRef: React.RefObject<AudioListener | null>
  /** Pending self state from server — position to sync to */
  pendingSelfState?: SelfStateData | null
  /** Callback to clear pending self state after applying */
  clearPendingSelfState?: () => void
  /** Initial object from world data (for authenticated users) */
  initialObject?: WorldObject3d | null
}

/**
 * Player component with physics and animations.
 * Uses RigidBody for physical body and CapsuleCollider for collisions.
 * Animations are loaded from separate GLB files and applied to the model.
 */
export const Player: React.FC<PlayerProps> = ({
  debug,
  sendPlayerState,
  audioListenerRef,
  pendingSelfState,
  clearPendingSelfState,
  initialObject,
}) => {
  const { user } = useAppContext()

  // Compute initial position and rotation from world data or use defaults
  const { initialPosition, initialYaw } = useMemo(() => {
    const matrix = initialObject?.matrix
    if (matrix && Array.isArray(matrix)) {
      const pos = extractPositionFromMatrix(matrix)
      const yaw = extractYawFromMatrix(matrix)
      return {
        initialPosition: pos,
        initialYaw: yaw,
      }
    }
    return {
      initialPosition: DEFAULT_SPAWN_POSITION,
      initialYaw: 0,
    }
  }, [initialObject?.matrix])

  // === Refs ===
  // rigidBodyRef — reference to Rapier physical body for controlling speed and position
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  // rigidBodyGroupRef — wrapper group inside RigidBody, visual rotation is applied to it
  const rigidBodyGroupRef = useRef<Group>(null)
  // avatarRef — group with 3D character model
  const avatarRef = useRef<Group>(null)
  // headRef — "head" point for AudioListener
  const headRef = useRef<Group>(null)

  // === State ===
  // Centralized player state via reducer (animation, debug position)
  const [state, dispatch] = usePlayerReducer()
  // Character rotation angle (in ref for instant update in useFrame)
  const rotationRef = useRef(initialYaw)
  // Flag for single 180° turn when pressing S
  const wasBackwardRef = useRef(false)
  // Vertical camera angle (pitch) — controlled by mouse
  const cameraPitchRef = useRef(0.2)
  const [cameraPitch, setCameraPitch] = useState(0.2)
  // Horizontal camera angle (yaw) — additional rotation relative to avatar
  const [cameraYaw, setCameraYaw] = useState(0)
  // Flag for tracking mouse hold
  const isDragging = useRef(false)

  // === Input ===
  // Get key state (WASD, Shift, Space)
  const [, getKeys] = useKeyboardControls()
  const { gl } = useThree()

  // === Mouse handling ===
  useEffect(() => {
    const canvas = gl.domElement

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging.current = true
      }
    }

    const onMouseUp = () => {
      isDragging.current = false
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) {
        return
      }

      // Horizontal: mouse movement left -> avatar rotation left
      rotationRef.current -= e.movementX * MOUSE_SENSITIVITY

      // Vertical: drag down -> camera lowers (looking up)
      cameraPitchRef.current += e.movementY * MOUSE_SENSITIVITY
      cameraPitchRef.current = Math.max(
        MIN_PITCH,
        Math.min(MAX_PITCH, cameraPitchRef.current),
      )
      setCameraPitch(cameraPitchRef.current)
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl])

  // Apply pending self state from server when RigidBody is ready
  useEffect(() => {
    if (!pendingSelfState) {
      return
    }

    const rb = rigidBodyRef.current

    if (!rb) {
      // RigidBody not ready yet — will retry on next render when it's available

      console.warn('[Player] RigidBody not ready, waiting...')
      return
    }

    // Teleport player to server position
    rb.setTranslation(
      {
        x: pendingSelfState.position.x,
        y: pendingSelfState.position.y,
        z: pendingSelfState.position.z,
      },
      true,
    )
    // Reset velocity to prevent drift
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true)

    // Apply rotation from quaternion
    const q = new Quaternion(
      pendingSelfState.rotation.x,
      pendingSelfState.rotation.y,
      pendingSelfState.rotation.z,
      pendingSelfState.rotation.w,
    )
    // Extract yaw from quaternion
    const yaw = Math.atan2(
      2 * (q.w * q.y + q.x * q.z),
      1 - 2 * (q.y * q.y + q.z * q.z),
    )
    rotationRef.current = yaw

    // Clear pending state
    clearPendingSelfState?.()
  }, [pendingSelfState, clearPendingSelfState, user?.id])

  // AudioListener attached to head group for spatial audio
  useEffect(() => {
    const head = headRef.current
    if (!head) {
      return
    }

    const listener = new AudioListener()
    head.add(listener)

    // Expose listener to parent via ref
    audioListenerRef.current = listener

    // Resume AudioContext on user interaction (browser autoplay policy)
    const resumeContext = () => {
      if (listener.context.state === 'suspended') {
        listener.context.resume()
      }
    }

    document.addEventListener('click', resumeContext)
    document.addEventListener('keydown', resumeContext)

    return () => {
      document.removeEventListener('click', resumeContext)
      document.removeEventListener('keydown', resumeContext)
      head.remove(listener)
      if (audioListenerRef) {
        audioListenerRef.current = null
      }
    }
  }, [audioListenerRef])

  // Movement direction vector (reused every frame)
  const direction = new Vector3()

  /**
   * Main game loop — called every frame.
   * Handles input, updates physics and animation state.
   */
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) {
      return
    }

    // --- Read input ---
    const { forward, backward, left, right, run, jump } = getKeys()

    // --- Get current physics state ---
    const velocity = rigidBodyRef.current.linvel()
    const position = rigidBodyRef.current.translation()

    // --- Respawn if fallen below world ---
    if (position.y < -50) {
      rigidBodyRef.current.setTranslation(
        {
          x: DEFAULT_SPAWN_POSITION[0],
          y: DEFAULT_SPAWN_POSITION[1],
          z: DEFAULT_SPAWN_POSITION[2],
        },
        true,
      )
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      return
    }

    // --- Calculate speed ---
    const speed = run ? RUN_SPEED : WALK_SPEED

    // --- Handle rotation (A/D) ---
    // A — turn left (increase angle)
    if (left) {
      rotationRef.current += TURN_SPEED * delta
    }
    // D — turn right (decrease angle)
    if (right) {
      rotationRef.current -= TURN_SPEED * delta
    }

    // --- Handle turn (S) ---
    // When pressing S — 180° turn (character walks towards camera)
    if (backward && !forward && !wasBackwardRef.current) {
      rotationRef.current += Math.PI
      wasBackwardRef.current = true
    }
    // When releasing S — reset flag for next turn
    if (!backward) {
      wasBackwardRef.current = false
    }

    // Update camera yaw: when moving backward — 180° rotation
    const newCameraYaw = backward && !forward ? Math.PI : 0
    if (newCameraYaw !== cameraYaw) {
      setCameraYaw(newCameraYaw)
    }

    // --- Calculate movement direction ---
    // W or S — move forward in character's looking direction
    const isMovingForward = forward || backward
    if (isMovingForward) {
      // Movement vector: sin/cos of rotation angle * speed
      direction.set(
        Math.sin(rotationRef.current) * speed,
        0,
        Math.cos(rotationRef.current) * speed,
      )
    } else {
      direction.set(0, 0, 0)
    }

    // --- Apply speed to physical body ---
    // Preserve vertical speed (gravity/jump)
    rigidBodyRef.current.setLinvel(
      { x: direction.x, y: velocity.y, z: direction.z },
      true,
    )

    // --- Handle jump ---
    const isOnGround = position.y < 1.1
    if (jump && isOnGround) {
      rigidBodyRef.current.setLinvel(
        { x: velocity.x, y: JUMP_FORCE, z: velocity.z },
        true,
      )
    }

    // --- Determine animation ---
    let newAnimation: AnimationName = 'idle'
    if (!isOnGround) {
      newAnimation = 'jump'
    } else if (isMovingForward) {
      newAnimation = run ? 'run' : 'walk'
    }
    dispatch({ type: 'SET_ANIMATION', payload: newAnimation })

    // --- Apply visual rotation ---
    // Rotate group (avatar + camera) in movement direction
    if (rigidBodyGroupRef.current) {
      rigidBodyGroupRef.current.rotation.y = rotationRef.current
    }

    // --- Send state to multiplayer server ---
    const canSendPlayerState = !!sendPlayerState && !!user?.id

    if (canSendPlayerState) {
      // Build 4x4 transformation matrix from position and rotation
      const m = new Matrix4()
      const q = new Quaternion()
      q.setFromAxisAngle(new Vector3(0, 1, 0), rotationRef.current)
      m.compose(
        new Vector3(position.x, position.y, position.z),
        q,
        new Vector3(1, 1, 1),
      )

      const outgoingState = {
        matrix: m.toArray(),
        animation: newAnimation,
      }

      sendPlayerState(outgoingState)
    }
  })

  return (
    <>
      {/* Player physical body — dynamic RigidBody with capsule collider */}
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        mass={1}
        type="dynamic"
        position={initialPosition}
        rotation={DEFAULT_SPAWN_ROTATION}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
      >
        {/* Wrapper group for tracking RigidBody visual object */}
        <group ref={rigidBodyGroupRef}>
          {/* Head group — AudioListener attachment point.
             rotation={[0, Math.PI, 0]} — 180° rotation for correct
             AudioListener orientation. Without this left-right is inverted,
             because avatar model is created with "front" in +Z, while Three.js expects -Z. */}
          <group
            ref={headRef}
            position={[0, 2.1, 0]}
            rotation={[0, Math.PI, 0]}
          >
            {/* Debug ring for AudioListener position */}
            {debug && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.9, 1, 32]} />
                <meshBasicMaterial color="orange" side={2} />
              </mesh>
            )}
          </group>
          {/* Capsule collider for physical collisions */}
          <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
          {/* Wireframe mesh for visualizing collider bounds (debug) */}

          {debug && <DebugCapsuleGeometry />}

          {/* Group for avatar — rotates during movement */}
          <group ref={avatarRef} position={[0, 0, 0]}>
            <Avatar animation={state.animation} />
          </group>
          {/* Third person camera — child object of RigidBody */}
          <ThirdPersonCamera pitch={cameraPitch} yaw={cameraYaw} />
        </group>
      </RigidBody>
      {/* HTML overlay for displaying coordinates (debug) */}
      {debug && (
        <DebugOverlay
          title="Avatar coords"
          style={{
            bottom: 280,
          }}
        >
          <>
            X: {state.debugPosition.x.toFixed(2)} Y:{' '}
            {state.debugPosition.y.toFixed(2)} Z:{' '}
            {state.debugPosition.z.toFixed(2)}
          </>
        </DebugOverlay>
      )}
      {/* Debug component — displays object directions */}
      {debug && (
        <DebugAvatarGeometry
          rigidBodyRef={rigidBodyGroupRef}
          avatarRef={avatarRef}
        />
      )}
    </>
  )
}

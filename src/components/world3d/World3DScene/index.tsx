'use client'

import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { KeyboardControls, Stats } from '@react-three/drei'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Ground } from '../Ground'
import { Player } from '../Player'
import { Lighting } from '../Lighting'
import { WorldObject } from '../WorldObject'
import { useWorldStore } from '../hooks/useWorldStore'
// import { SpatialAudioSource } from '../SpatialAudioSource'
import { MuteButton } from '../MuteButton'
import { MuteWorldButton } from '../MuteWorldButton'
import { ConnectionOverlay } from '../ConnectionOverlay'
import { DebugVoiceChatOverlay } from '../components/debug/DebugVoiceChatOverlay'
import {
  World3DSceneGlobalStyles,
  World3DSceneStyled,
  World3DSceneControlsStyled,
} from './styles'
import { useMultiplayer } from '../hooks/useMultiplayer'
import { useVoiceChat } from '../hooks/useVoiceChat'
import { useAppContext } from 'src/components/AppContext'
import type { AudioListener } from 'three'
import type { WorldObject3d } from '../hooks/useWorldStore'

const debug = process.env.NEXT_PUBLIC_DEBUG_WORLD3D === 'true'
const debugPhysics = process.env.NEXT_PUBLIC_DEBUG_WORLD3D_PHYSICS === 'true'

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'jump', keys: ['Space'] },
]

function getObjectKind(object: WorldObject3d): string {
  const userData = object.userData as { type?: unknown } | undefined
  return typeof userData?.type === 'string'
    ? userData.type
    : typeof object.type === 'string'
      ? object.type
      : 'Object3D'
}

function getObjectId(object: WorldObject3d): string | null {
  const userData = object.userData as { id?: unknown } | undefined
  if (typeof userData?.id === 'string' && userData.id) {
    return userData.id
  }
  if (typeof object.name === 'string' && object.name) {
    return object.name
  }
  if (typeof object.uuid === 'string' && object.uuid) {
    return object.uuid
  }
  return null
}

function collectPlayers(root: WorldObject3d | null): WorldObject3d[] {
  if (!root) {
    return []
  }

  const result: WorldObject3d[] = []
  const queue: WorldObject3d[] = [root]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }

    if (getObjectKind(current) === 'player') {
      result.push(current)
    }

    if (Array.isArray(current.children)) {
      queue.push(...current.children)
    }
  }

  return result
}

export const World3DScene: React.FC = () => {
  const { user, userLoading } = useAppContext()
  const {
    root: worldRoot,
    localPlayerObject,
    updateObject,
    refetchWorld,
  } = useWorldStore()

  const [storedToken, setStoredToken] = useState<string | null>(null)

  useEffect(() => {
    const currentToken = localStorage?.getItem('token') ?? null
    setStoredToken(currentToken)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        setStoredToken(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    const currentToken = localStorage?.getItem('token') ?? null
    setStoredToken(currentToken)
  }, [user])

  const token = user?.id ? storedToken : null

  // Multiplayer WS connection — always enabled, token determines auth mode
  const {
    wsRef,
    pendingSelfState,
    clearPendingSelfState,
    sendPlayerState,
    onSignalingMessageRef,
    turnCredentialsRef,
    connectionStatus,
    reconnect,
  } = useMultiplayer({
    enabled: !userLoading,
    authUserId: user?.id ?? null,
    token,
    onObjectUpdate: updateObject,
    onWorldChanged: refetchWorld,
  })

  // Debug: count players from world store
  const worldRootPlayers = useMemo(() => collectPlayers(worldRoot), [worldRoot])

  // Remote player IDs from world store (for voice chat)
  const remotePlayerIds = useMemo(() => {
    return worldRootPlayers
      .map((player) => getObjectId(player))
      .filter((playerId): playerId is string => typeof playerId === 'string')
  }, [worldRootPlayers])

  // Voice chat — WebRTC P2P mesh with spatial audio
  const { remoteStreams, isMuted, toggleMute, peersRef, localStreamRef } =
    useVoiceChat({
      enabled: !!user,
      localPlayerId: user?.id ?? null,
      wsRef,
      onSignalingMessageRef,
      turnCredentialsRef,
      remotePlayerIds,
    })

  // AudioListener ref — exposed by Player for world mute control
  const audioListenerRef = useRef<AudioListener | null>(null)
  // World mute state — controls AudioListener gain (mutes all 3D sounds)
  const [isWorldMuted, setIsWorldMuted] = useState(false)
  // Ground ready state — Player renders only after ground collider is initialized
  const [isGroundReady, setIsGroundReady] = useState(false)

  const handleGroundReady = useCallback(() => {
    setIsGroundReady(true)
  }, [])

  const toggleWorldMute = useCallback(() => {
    const listener = audioListenerRef.current
    if (!listener) {
      return
    }
    const newMuted = !isWorldMuted
    listener.setMasterVolume(newMuted ? 0 : 1)
    setIsWorldMuted(newMuted)
  }, [isWorldMuted])

  return (
    <>
      <World3DSceneGlobalStyles />
      <World3DSceneStyled>
        <KeyboardControls map={keyboardMap}>
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            <Suspense fallback={null}>
              {debug && <Stats className="drai--debug-stats" />}
              <Physics gravity={[0, -9.81, 0]} debug={debug && debugPhysics}>
                {debug && <axesHelper args={[10]} />}
                <Lighting />
                <Ground onReady={handleGroundReady} />
                {/* All physics objects render only after ground collider is ready */}
                {isGroundReady && (
                  <>
                    {worldRoot && <WorldObject object={worldRoot} />}
                    <Player
                      key={user?.id}
                      debug={debug}
                      sendPlayerState={sendPlayerState}
                      audioListenerRef={audioListenerRef}
                      pendingSelfState={pendingSelfState}
                      clearPendingSelfState={clearPendingSelfState}
                      initialObject={localPlayerObject}
                    />
                    {/* Remote players are now rendered via WorldObject from world store */}
                    {/* Test spatial audio source - positioned near the building */}
                    {/* <SpatialAudioSource
                      url="/assets/sounds/test.mp3"
                      position={[0, 2, 0]}
                      rotation={[0, 0, 0]}
                      refDistance={0.1}
                      maxDistance={4}
                      rolloffFactor={1}
                      coneInnerAngle={30}
                      coneOuterAngle={90}
                      coneOuterGain={0.1}
                      debug={debug}
                    /> */}
                  </>
                )}
              </Physics>
            </Suspense>
          </Canvas>
        </KeyboardControls>
        {/* Audio control buttons — mic mute + world mute */}
        {user && (
          <World3DSceneControlsStyled>
            <MuteButton isMuted={isMuted} onToggle={toggleMute} />
            <MuteWorldButton
              isMuted={isWorldMuted}
              onToggle={toggleWorldMute}
            />
          </World3DSceneControlsStyled>
        )}
        {/* WS connection status overlay — shown on error or session replaced */}
        <ConnectionOverlay status={connectionStatus} onReconnect={reconnect} />
        {/* WebRTC voice chat debug overlay */}
        {debug && user && (
          <DebugVoiceChatOverlay
            peersRef={peersRef}
            localStreamRef={localStreamRef}
            isMuted={isMuted}
            remoteStreams={remoteStreams}
            wsRef={wsRef}
            turnCredentialsRef={turnCredentialsRef}
          />
        )}
      </World3DSceneStyled>
    </>
  )
}

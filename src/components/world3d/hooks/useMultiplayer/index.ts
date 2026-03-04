import { useEffect, useRef, useCallback, useReducer, useState } from 'react'
import { multiplayerReducer, initialMultiplayerState } from './reducer'
import type { LocalPlayerState } from './interfaces'
import type { WorldObject3d } from '../useWorldStore'

export type {
  RemotePlayerData,
  LocalPlayerState,
  SelfStateData,
} from './interfaces'

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'session_replaced'

/**
 * Multiplayer WebSocket hook — connects to world3d WS server.
 * Handles: connection with JWT auth, heartbeat (pong), reconnection,
 * remote players state (via reducer), and adaptive player state sending.
 */

// Message types matching docker/world3d/src/protocol.ts
const S2C_PING = 'ping'
const S2C_PLAYER_JOINED = 'player_joined'
const S2C_PLAYER_LEFT = 'player_left'
const S2C_OBJECT_CREATED = 'object_created'
const S2C_OBJECT_UPDATE = 'object_update'
const S2C_OBJECT_DELETED = 'object_deleted'
const S2C_ERROR = 'error'
const S2C_OFFER = 'offer'
const S2C_ANSWER = 'answer'
const S2C_ICE_CANDIDATE = 'ice_candidate'
const S2C_TURN_CREDENTIALS = 'turn_credentials'
const S2C_SELF_STATE = 'self_state'
const C2S_PONG = 'pong'
const C2S_PLAYER_STATE = 'player_state'

const WS_PATH = '/world3d-service'
const RECONNECT_DELAY = 3000
const WS_CLOSE_SESSION_REPLACED = 4009

// Adaptive send rate thresholds (ms)
const SEND_INTERVAL_IDLE = 3000
const SEND_INTERVAL_ACTIVE = 500

// Minimum position change to consider "active" movement
const POSITION_CHANGE_THRESHOLD = 0.01

/** TURN server credentials received from world3d server */
export interface TurnCredentials {
  urls: string[]
  username: string
  credential: string
  ttl: number
}

/** WebRTC signaling message relayed through world3d WS server */
export type SignalingMessage =
  | { type: 'offer'; fromPlayerId: string; sdp: string }
  | { type: 'answer'; fromPlayerId: string; sdp: string }
  | { type: 'ice_candidate'; fromPlayerId: string; candidate: string }

/** Object update received from server */
export interface ObjectUpdate {
  id: string
  object: WorldObject3d
}

interface UseMultiplayerOptions {
  /** Whether multiplayer connection is enabled */
  enabled: boolean
  /** Resolved current user id for authenticated connections */
  authUserId: string | null
  /** JWT token for authenticated connection (optional) */
  token: string | null
  /** Callback for object updates from WebSocket */
  onObjectUpdate?: (update: ObjectUpdate) => void
  /** Callback when object is created or deleted (triggers refetch) */
  onWorldChanged?: () => void
}

/**
 * Hook for multiplayer WebSocket connection to world3d server.
 * Connects without token (read-only) or with token (full access).
 * Handles heartbeat, reconnection, remote players state, and adaptive state sending.
 */
export function useMultiplayer({
  enabled,
  authUserId,
  token,
  onObjectUpdate,
  onWorldChanged,
}: UseMultiplayerOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('idle')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled
  const authUserIdRef = useRef(authUserId)
  authUserIdRef.current = authUserId
  const tokenRef = useRef(token)
  tokenRef.current = token
  const onObjectUpdateRef = useRef(onObjectUpdate)
  onObjectUpdateRef.current = onObjectUpdate
  const onWorldChangedRef = useRef(onWorldChanged)
  onWorldChangedRef.current = onWorldChanged

  // Callback ref for signaling messages — set by useVoiceChat
  const onSignalingMessageRef = useRef<
    ((msg: SignalingMessage) => void) | null
  >(null)
  // TURN credentials received from server
  const turnCredentialsRef = useRef<TurnCredentials | null>(null)

  const [state, dispatch] = useReducer(
    multiplayerReducer,
    initialMultiplayerState,
  )

  // Adaptive send rate state (refs for use in useFrame without re-renders)
  const lastSentStateRef = useRef<LocalPlayerState | null>(null)
  const lastSendTimeRef = useRef(0)

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'unmount')
      wsRef.current = null
    }
    dispatch({ type: 'RESET' })
    setIsAuthenticated(false)
  }, [])

  const connect = useCallback(() => {
    if (!enabledRef.current) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    cleanup()

    setConnectionStatus('connecting')

    const currentAuthUserId = authUserIdRef.current
    const currentToken = currentAuthUserId ? tokenRef.current : null
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsBaseUrl = `${wsProtocol}//${window.location.host}${WS_PATH}`
    const wsUrl = currentToken
      ? `${wsBaseUrl}?token=${currentToken}`
      : wsBaseUrl
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setConnectionStatus('connected')
      setIsAuthenticated(!!currentToken)
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string)
        if (!msg || typeof msg.type !== 'string') {
          return
        }

        switch (msg.type) {
          case S2C_PING:
            // Respond to heartbeat
            ws.send(JSON.stringify({ type: C2S_PONG }))
            break

          case S2C_PLAYER_JOINED:
            break

          case S2C_PLAYER_LEFT:
            dispatch({ type: 'PLAYER_LEFT', playerId: msg.playerId })
            break

          case S2C_OBJECT_CREATED:
            if (onWorldChangedRef.current) {
              onWorldChangedRef.current()
            }
            break

          case S2C_OBJECT_UPDATE:
            // Forward object update to world store
            if (onObjectUpdateRef.current && msg.object) {
              onObjectUpdateRef.current({
                id: msg.id,
                object: msg.object as WorldObject3d,
              })
            }
            break

          case S2C_OBJECT_DELETED:
            if (onWorldChangedRef.current) {
              onWorldChangedRef.current()
            }
            break

          case S2C_ERROR:
            console.error(`[multiplayer] Server error: ${msg.message}`)
            break

          case S2C_TURN_CREDENTIALS:
            turnCredentialsRef.current = {
              urls: msg.urls,
              username: msg.username,
              credential: msg.credential,
              ttl: msg.ttl,
            }

            break

          case S2C_SELF_STATE:
            dispatch({
              type: 'SELF_STATE',
              data: {
                playerId: msg.playerId,
                username: msg.username,
                position: msg.position,
                rotation: msg.rotation,
                animation: msg.animation,
                isNew: msg.isNew,
              },
            })
            break

          case S2C_OFFER:
          case S2C_ANSWER:
          case S2C_ICE_CANDIDATE:
            // Forward signaling messages to voice chat hook
            if (onSignalingMessageRef.current) {
              onSignalingMessageRef.current(msg)
            }
            break
        }
      } catch {
        // Ignore invalid messages
      }
    }

    ws.onclose = (event) => {
      console.warn(
        `[multiplayer] Disconnected (code: ${event.code}, reason: ${event.reason})`,
      )
      wsRef.current = null

      if (event.code === WS_CLOSE_SESSION_REPLACED) {
        // Session replaced — do not reconnect, wait for user action
        console.warn('[multiplayer] Session replaced by another tab/window')
        setConnectionStatus('session_replaced')
      } else if (enabledRef.current && event.code !== 1000) {
        // Connection lost unexpectedly — set error and schedule reconnect
        setConnectionStatus('error')
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY)
      }
    }

    ws.onerror = () => {
      // onclose will fire after onerror, reconnect handled there
    }
  }, [cleanup])

  /**
   * Send local player state to server with adaptive throttling.
   * Call this every frame from useFrame — it will internally throttle.
   * - Active movement: sends every ~500ms
   * - Idle (no position change): sends every ~3s
   * - Skips send if state hasn't changed at all
   */
  const sendPlayerState = useCallback((playerState: LocalPlayerState) => {
    const now = Date.now()
    const last = lastSentStateRef.current
    const elapsed = now - lastSendTimeRef.current

    // Extract position from matrix (indices 12, 14 in column-major 4x4, skip Y)
    const posX = playerState.matrix[12]
    const posZ = playerState.matrix[14]

    // Skip initial state — don't send until player actually moves
    if (!last) {
      lastSentStateRef.current = {
        ...playerState,
        matrix: [...playerState.matrix],
      }
      lastSendTimeRef.current = now
      return
    }

    // Determine if position changed significantly
    const positionChanged =
      Math.abs(posX - last.matrix[12]) > POSITION_CHANGE_THRESHOLD ||
      Math.abs(posZ - last.matrix[14]) > POSITION_CHANGE_THRESHOLD

    // Determine if rotation changed (compare first column of rotation matrix: indices 0, 2)
    const rotationChanged =
      Math.abs(playerState.matrix[0] - last.matrix[0]) >
        POSITION_CHANGE_THRESHOLD ||
      Math.abs(playerState.matrix[2] - last.matrix[2]) >
        POSITION_CHANGE_THRESHOLD

    // Determine if animation changed
    const animationChanged = playerState.animation !== last.animation

    // Adaptive interval: active movement or rotation → faster, idle → slower
    const interval =
      positionChanged || rotationChanged
        ? SEND_INTERVAL_ACTIVE
        : SEND_INTERVAL_IDLE

    // Skip if not enough time elapsed and nothing important changed
    if (elapsed < interval && !animationChanged) {
      return
    }

    // Skip if absolutely nothing changed and we already sent at least once
    if (last && !positionChanged && !rotationChanged && !animationChanged) {
      return
    }

    lastSentStateRef.current = {
      ...playerState,
      matrix: [...playerState.matrix],
    }
    lastSendTimeRef.current = now

    const ws = wsRef.current

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn(
        '[sendPlayerState] SKIP: ws=%s, readyState=%s',
        ws ? 'exists' : 'null',
        ws?.readyState ?? 'N/A',
      )
      return
    }

    ws.send(
      JSON.stringify({
        type: C2S_PLAYER_STATE,
        matrix: playerState.matrix,
        animation: playerState.animation,
      }),
    )
  }, [])

  // Single effect for connection management
  // Connects when enabled, reconnects when auth identity or token changes
  useEffect(() => {
    if (enabled) {
      connect()
    } else {
      cleanup()
    }

    return cleanup
  }, [enabled, authUserId, token, connect, cleanup])

  const clearPendingSelfState = useCallback(() => {
    dispatch({ type: 'CLEAR_SELF_STATE' })
  }, [])

  return {
    wsRef,
    remotePlayers: state.remotePlayers,
    pendingSelfState: state.pendingSelfState,
    clearPendingSelfState,
    sendPlayerState,
    onSignalingMessageRef,
    turnCredentialsRef,
    connectionStatus,
    isAuthenticated,
    reconnect: connect,
  }
}

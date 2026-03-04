/**
 * Multiplayer state reducer — manages remote players map.
 * Pure state management, no side effects.
 */

import type { RemotePlayerData, SelfStateData } from './interfaces'

// --- State ---

export interface MultiplayerState {
  remotePlayers: Map<string, RemotePlayerData>
  /** Pending self state — set when server sends position, cleared after Player applies it */
  pendingSelfState: SelfStateData | null
}

export const initialMultiplayerState: MultiplayerState = {
  remotePlayers: new Map(),
  pendingSelfState: null,
}

// --- Actions ---

type MultiplayerAction =
  | { type: 'WORLD_STATE'; players: RemotePlayerData[] }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'SELF_STATE'; data: SelfStateData }
  | { type: 'CLEAR_SELF_STATE' }
  | { type: 'RESET' }

// --- Reducer ---

export function multiplayerReducer(
  state: MultiplayerState,
  action: MultiplayerAction,
): MultiplayerState {
  switch (action.type) {
    // Replace entire remote players map from server snapshot
    case 'WORLD_STATE': {
      const next = new Map<string, RemotePlayerData>()
      for (const p of action.players) {
        next.set(p.playerId, p)
      }
      return { ...state, remotePlayers: next }
    }

    // Remove a single player
    case 'PLAYER_LEFT': {
      const next = new Map(state.remotePlayers)
      next.delete(action.playerId)
      return { ...state, remotePlayers: next }
    }

    // Set pending self state from server
    case 'SELF_STATE':
      return { ...state, pendingSelfState: action.data }

    // Clear pending self state after Player applied it
    case 'CLEAR_SELF_STATE':
      return { ...state, pendingSelfState: null }

    // Clear all state (disconnect / cleanup)
    case 'RESET':
      return initialMultiplayerState

    default:
      return state
  }
}

import { useReducer } from 'react'
import { AnimationName } from '../../interfaces'

/**
 * Player state.
 * - animation: current animation (idle, walk, run, jump)
 * - rotation: character rotation angle in radians (0 = looking along +Z)
 * - wasBackward: flag for single 180° turn when pressing S
 * - debugPosition: position for debug overlay
 */
interface PlayerState {
  animation: AnimationName
  rotation: number
  wasBackward: boolean
  debugPosition: { x: number; y: number; z: number }
}

/**
 * Actions for controlling player state.
 * - SET_ANIMATION: change animation (ignored if already active)
 * - TURN_LEFT/TURN_RIGHT: rotate character by given angle (A/D keys)
 * - REVERSE: 180° turn when pressing S (triggers once)
 * - RESET_BACKWARD: reset wasBackward flag when releasing S
 * - SET_DEBUG_POSITION: update position for debug
 */
type PlayerAction =
  | { type: 'SET_ANIMATION'; payload: AnimationName }
  | { type: 'TURN_LEFT'; payload: number }
  | { type: 'TURN_RIGHT'; payload: number }
  | { type: 'REVERSE' }
  | { type: 'RESET_BACKWARD' }
  | { type: 'SET_DEBUG_POSITION'; payload: { x: number; y: number; z: number } }

const initialPlayerState: PlayerState = {
  animation: 'idle',
  rotation: 0,
  wasBackward: false,
  debugPosition: { x: 0, y: 0, z: 0 },
}

/**
 * Reducer for controlling player state.
 * Pure function — doesn't mutate state, returns new object on changes.
 */
function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    // Change animation — skip if already active (avoid unnecessary re-renders)
    case 'SET_ANIMATION':
      if (state.animation === action.payload) {
        return state
      }
      return { ...state, animation: action.payload }

    // Turn left — increase angle (counter-clockwise)
    case 'TURN_LEFT':
      return { ...state, rotation: state.rotation + action.payload }

    // Turn right — decrease angle (clockwise)
    case 'TURN_RIGHT':
      return { ...state, rotation: state.rotation - action.payload }

    // 180° turn — triggers only once when holding S
    case 'REVERSE':
      if (state.wasBackward) {
        return state
      }
      return { ...state, rotation: state.rotation + Math.PI, wasBackward: true }

    // Reset turn flag — when releasing S
    case 'RESET_BACKWARD':
      if (!state.wasBackward) {
        return state
      }
      return { ...state, wasBackward: false }

    // Update position for debug overlay
    case 'SET_DEBUG_POSITION':
      return { ...state, debugPosition: action.payload }

    default:
      return state
  }
}

/**
 * Hook for controlling player state via reducer.
 * Returns [state, dispatch] — current state and action dispatch function.
 */
export function usePlayerReducer() {
  return useReducer(playerReducer, initialPlayerState)
}

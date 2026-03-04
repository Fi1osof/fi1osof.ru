/**
 * World store hook — unified state management for 3D world objects.
 *
 * Architecture:
 * - GraphQL API loads initial world scene as native Three.js JSON
 * - WebSocket updates objects with native Three.js object JSON
 * - State keeps raw scene JSON with minimal transformations
 */

import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useWorld3dSceneQuery } from 'src/gql/generated/world3dScene'
import { useAppContext } from 'src/components/AppContext'

// --- Types ---

interface WorldSceneSerialized {
  metadata?: Record<string, unknown>
  object?: WorldObject3d
}

export interface WorldObject3d {
  uuid?: string
  type?: string
  name?: string
  matrix?: number[]
  layers?: number
  up?: number[]
  userData?: Record<string, unknown>
  children?: WorldObject3d[]
  [key: string]: unknown
}

export interface ObjectUpdate {
  id: string
  object: WorldObject3d
}

// --- State ---

interface WorldStoreState {
  root: WorldObject3d | null
  loading: boolean
  error: Error | null
}

const initialState: WorldStoreState = {
  root: null,
  loading: true,
  error: null,
}

// --- Actions ---

type WorldStoreAction =
  | { type: 'LOAD_INITIAL'; root: WorldObject3d }
  | { type: 'UPDATE_OBJECT'; update: ObjectUpdate }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: Error | null }
  | { type: 'RESET' }

// --- Helpers ---

function isWorldObject3d(value: unknown): value is WorldObject3d {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.type === 'string' ||
    typeof candidate.name === 'string' ||
    Array.isArray(candidate.children) ||
    Array.isArray(candidate.matrix) ||
    typeof candidate.userData === 'object'
  )
}

function normalizeWorldScenePayload(payload: unknown): WorldObject3d | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  if (isWorldObject3d(payload)) {
    return payload
  }

  const serialized = payload as WorldSceneSerialized
  return isWorldObject3d(serialized.object) ? serialized.object : null
}

function normalizeObjectUpdatePayload(payload: unknown): WorldObject3d | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  if (isWorldObject3d(payload)) {
    return payload
  }

  const serialized = payload as WorldSceneSerialized
  return isWorldObject3d(serialized.object) ? serialized.object : null
}

function cloneWorldObject(obj: WorldObject3d): WorldObject3d {
  return JSON.parse(JSON.stringify(obj)) as WorldObject3d
}

function getObjectId(obj: WorldObject3d): string | null {
  const userData = obj.userData as { id?: unknown } | undefined
  if (typeof userData?.id === 'string' && userData.id) {
    return userData.id
  }
  if (typeof obj.name === 'string' && obj.name) {
    return obj.name
  }
  return typeof obj.uuid === 'string' ? obj.uuid : null
}

/**
 * Get userData.id for player matching (used to find local player by auth user id).
 */
function getObjectUserId(obj: WorldObject3d): string | null {
  const userData = obj.userData as { id?: unknown } | undefined
  return typeof userData?.id === 'string' ? userData.id : null
}

function getObjectKind(obj: WorldObject3d): string {
  const userData = obj.userData as { type?: unknown } | undefined
  if (typeof userData?.type === 'string' && userData.type) {
    return userData.type
  }
  return typeof obj.type === 'string' ? obj.type : 'Object3D'
}

function findLocalPlayerObject(object: WorldObject3d): WorldObject3d | null {
  const userData = object.userData as { isLocalPlayer?: boolean } | undefined
  if (userData?.isLocalPlayer) {
    return object
  }

  if (Array.isArray(object.children)) {
    for (const child of object.children) {
      const found = findLocalPlayerObject(child)
      if (found) {
        return found
      }
    }
  }

  return null
}

function prepareWorldObject(
  object: WorldObject3d,
  localPlayerId: string | null,
): WorldObject3d {
  const preparedChildren = Array.isArray(object.children)
    ? object.children.map((child) => prepareWorldObject(child, localPlayerId))
    : undefined

  const objectUserId = getObjectUserId(object)
  const isLocalPlayer =
    !!localPlayerId &&
    getObjectKind(object) === 'player' &&
    objectUserId === localPlayerId

  const currentUserData = object.userData
  const nextUserData =
    currentUserData && typeof currentUserData === 'object'
      ? {
          ...currentUserData,
          isLocalPlayer,
        }
      : isLocalPlayer
        ? { isLocalPlayer: true }
        : currentUserData

  return {
    ...object,
    userData: nextUserData,
    children: preparedChildren,
  }
}

function mergeWorldObject(
  current: WorldObject3d,
  patch: WorldObject3d,
): WorldObject3d {
  const currentChildren = Array.isArray(current.children)
    ? current.children
    : []
  const patchChildren = Array.isArray(patch.children)
    ? patch.children
    : undefined

  return {
    ...current,
    ...patch,
    userData:
      current.userData || patch.userData
        ? {
            ...(current.userData ?? {}),
            ...(patch.userData ?? {}),
          }
        : undefined,
    children:
      patchChildren === undefined
        ? currentChildren
        : patchChildren.map((childPatch, index) => {
            const currentChild = currentChildren[index]
            return currentChild
              ? mergeWorldObject(currentChild, childPatch)
              : cloneWorldObject(childPatch)
          }),
  }
}

function updateObjectInTree(
  root: WorldObject3d,
  targetId: string,
  patch: WorldObject3d,
): WorldObject3d {
  const rootId = getObjectId(root)
  if (rootId === targetId) {
    return mergeWorldObject(root, patch)
  }

  const children = Array.isArray(root.children) ? root.children : []
  let changed = false
  const nextChildren = children.map((child) => {
    const nextChild = updateObjectInTree(child, targetId, patch)
    if (nextChild !== child) {
      changed = true
    }
    return nextChild
  })

  if (!changed) {
    return root
  }

  return {
    ...root,
    children: nextChildren,
  }
}

// --- Reducer ---

function worldStoreReducer(
  state: WorldStoreState,
  action: WorldStoreAction,
): WorldStoreState {
  switch (action.type) {
    case 'LOAD_INITIAL': {
      const root = cloneWorldObject(action.root)
      return {
        ...state,
        root,
        loading: false,
        error: null,
      }
    }

    case 'UPDATE_OBJECT': {
      if (!state.root) {
        return state
      }

      const patch = normalizeObjectUpdatePayload(action.update.object)
      if (!patch) {
        return state
      }

      const nextRoot = updateObjectInTree(state.root, action.update.id, patch)

      return {
        ...state,
        root: nextRoot,
      }
    }

    case 'SET_LOADING':
      return { ...state, loading: action.loading }

    case 'SET_ERROR':
      return { ...state, error: action.error }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// --- Hook ---

export function useWorldStore() {
  const { user } = useAppContext()
  const [state, dispatch] = useReducer(worldStoreReducer, initialState)

  // Load initial world state from GraphQL
  const { data, loading, error, refetch } = useWorld3dSceneQuery({
    fetchPolicy: 'cache-and-network',
  })

  // Initialize store when GraphQL data arrives
  useEffect(() => {
    const root = normalizeWorldScenePayload(data?.response)
    if (root) {
      dispatch({
        type: 'LOAD_INITIAL',
        root: prepareWorldObject(root, user?.id ?? null),
      })
    }
  }, [data?.response, user?.id])

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', loading })
  }, [loading])

  useEffect(() => {
    if (error) {
      dispatch({ type: 'SET_ERROR', error })
    }
  }, [error])

  // Update object properties (called from WebSocket handler)
  const updateObject = useCallback((update: ObjectUpdate) => {
    dispatch({ type: 'UPDATE_OBJECT', update })
  }, [])

  // Batch update multiple objects
  const updateObjects = useCallback((updates: ObjectUpdate[]) => {
    for (const update of updates) {
      dispatch({ type: 'UPDATE_OBJECT', update })
    }
  }, [])

  // Refetch world state (called when object created/deleted via WebSocket)
  const refetchWorld = useCallback(() => {
    refetch()
  }, [refetch])

  // Find local player object in the world tree
  const localPlayerObject = useMemo(() => {
    if (!state.root) {
      return null
    }
    return findLocalPlayerObject(state.root)
  }, [state.root])

  return {
    root: state.root,
    localPlayerObject,
    loading: state.loading,
    error: state.error,
    updateObject,
    updateObjects,
    refetchWorld,
  }
}

# Player Sync

## Overview

This document describes how player initialization, spawn, and position synchronization work between frontend and backend.

## Key Concepts

- **Single Source of Truth**: Three.js scene on server (`World3DStore`)
- **Frontend-first movement**: Player moves locally, syncs to server
- **Server-authoritative spawn**: Initial position comes from server
- **Reactive state sync**: Uses reducer state, not refs, for reliable React updates

## Initialization Order

Understanding the exact order of initialization is critical for debugging sync issues:

```
1. Page loads
   └── Player component renders with default position [0, 2, -10]
   └── RigidBody may or may not be ready yet

2. GraphQL query fetches current user data
   └── User state updates in AppContext

3. useMultiplayer hook detects user is authenticated
   └── WebSocket connection initiated with JWT token

4. Server receives connection
   └── Checks if player exists in World3DStore (scene)
   └── Sends self_state message with position/rotation

5. useMultiplayer receives self_state
   └── Dispatches SELF_STATE action to reducer
   └── pendingSelfState is set in state

6. Player component re-renders (pendingSelfState changed)
   └── useEffect detects pendingSelfState
   └── If RigidBody ready → teleport player, clear state
   └── If RigidBody not ready → wait for next render
```

## Player Lifecycle

### 1. Page Load (Unauthenticated)

```
Page loads → Player component renders → Default position [0, 2, -10]
```

At this stage:
- No WebSocket connection (user not authenticated)
- Player spawns at hardcoded default position
- RigidBody initializes with default coords

### 2. Authentication

```
User authenticates → useMultiplayer connects to WebSocket
```

### 3. Server Connection

```
WebSocket connects → Server checks if player exists in scene
├── Player exists → Send self_state with saved position
└── Player not found → Spawn at [0, 0, 0], send self_state with isNew=true
```

Server code (`docker/world3d/src/index.ts`):
```typescript
let existingPlayer = world3dStore.getPlayer(payload.userId)
if (!existingPlayer) {
  existingPlayer = world3dStore.updatePlayer(payload.userId, {
    position: spawnPosition,
    rotation: spawnRotation,
    animation: 'idle',
  })
  isNewPlayer = true
}
```

### 4. Frontend Position Sync

```
Frontend receives self_state → Reducer stores pendingSelfState → Player teleports
```

**Implementation**: Uses reducer state for reactive updates (not refs):

```typescript
// In useMultiplayer — dispatch to reducer
case S2C_SELF_STATE:
  dispatch({ type: 'SELF_STATE', data: { position, rotation, ... } })

// In Player — useEffect reacts to state change
useEffect(() => {
  if (!pendingSelfState) return
  
  const rb = rigidBodyRef.current
  if (!rb) return  // Wait for next render
  
  rb.setTranslation(pendingSelfState.position, true)
  rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
  
  clearPendingSelfState()  // Dispatch CLEAR_SELF_STATE
}, [pendingSelfState, clearPendingSelfState])
```

**Why reducer instead of refs?**
- Refs don't trigger re-renders — callback may be called before component is ready
- Reducer state change triggers re-render, useEffect runs when RigidBody is available
- More predictable React data flow

### 5. Continuous Sync

```
Player moves → sendPlayerState() → Server updates scene → Broadcasts to others
```

- Frontend sends `player_state` message on movement
- Server updates `World3DStore` (persists to `world.json`)
- Server broadcasts `world_state` to other players

## Protocol Messages

### Server → Client

| Message | Description |
|---------|-------------|
| `self_state` | Current player's position on connect |
| `world_state` | All players' positions (periodic broadcast) |
| `player_joined` | New player connected |
| `player_left` | Player disconnected |

### Client → Server

| Message | Description |
|---------|-------------|
| `player_state` | Local player position update |
| `pong` | Heartbeat response |

## Data Flow Diagram

```
┌─────────────┐     self_state      ┌─────────────┐
│   Frontend  │◄────────────────────│   Backend   │
│   (Player)  │                     │  (world3d)  │
│             │    player_state     │             │
│             │────────────────────►│             │
│             │                     │             │
│             │    world_state      │             │
│             │◄────────────────────│             │
└─────────────┘                     └─────────────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │ world.json  │
                                    │ (persist)   │
                                    └─────────────┘
```

## Position Validation

Server validates all object positions before saving to prevent objects falling infinitely:

```typescript
// In store.ts
const MIN_Y_POSITION = -10
const SAFE_Y_POSITION = 2

function sanitizePosition(position: Vec3): Vec3 {
  if (position.y < MIN_Y_POSITION) {
    return { x: position.x, y: SAFE_Y_POSITION, z: position.z }
  }
  return position
}
```

This applies to **all objects** (players, entities, etc.) — any object with Y < -10 is automatically respawned at Y = 2.

## Files

| File | Purpose |
|------|---------|
| `src/components/world3d/Player/index.tsx` | Local player, handles `pendingSelfState` |
| `src/components/world3d/hooks/useMultiplayer/index.ts` | WebSocket connection, reducer |
| `src/components/world3d/hooks/useMultiplayer/reducer.ts` | State management for remote players and self state |
| `docker/world3d/src/index.ts` | WebSocket server, spawn logic |
| `docker/world3d/src/store.ts` | Scene persistence, position validation |
| `docker/world3d/src/protocol.ts` | Message types |

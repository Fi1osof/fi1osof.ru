# World3D Documentation

## Overview

World3D is a multiplayer 3D environment built with:
- **Frontend**: React Three Fiber + Rapier physics
- **Backend**: Node.js WebSocket server (`docker/world3d/`)
- **State**: Three.js scene as single source of truth

## Architecture

```
Frontend (Next.js)
├── World3DScene — main canvas with Physics
├── Player — local player with RigidBody
├── WorldObject — renders ALL objects from store (including players)
├── useWorldStore — unified world state (GraphQL + WebSocket updates)
└── useMultiplayer — WebSocket connection hook

Backend (docker/world3d)
├── WebSocket Server (port 4100) — real-time sync (object_update)
├── HTTP API (port 4101) — GraphQL integration
└── World3DStore — Three.js scene persistence
```

## Data Flow

```
GraphQL API (world3dScene) → useWorldStore (initial load)
                                    ↑
WebSocket (object_update) ──────────┘ (incremental updates)
                                    ↓
                              WorldObject (render)
```

- **GraphQL API** — source of truth for initial world state
- **WebSocket** — incremental updates only (`object_update` messages)
- **useWorldStore** — unified store with nested object structure

## Key Components

### Frontend

| Component | Path | Description |
|-----------|------|-------------|
| `World3DScene` | `src/components/world3d/World3DScene/` | Main 3D canvas |
| `Player` | `src/components/world3d/Player/` | Local player controller |
| `WorldObject` | `src/components/world3d/WorldObject/` | Renders all objects from store |
| `useWorldStore` | `src/components/world3d/hooks/useWorldStore/` | Unified world state |
| `useMultiplayer` | `src/components/world3d/hooks/useMultiplayer/` | WebSocket hook |

### Backend

| Module | Path | Description |
|--------|------|-------------|
| WebSocket Server | `docker/world3d/src/ws.ts` | Connection handling, object_update broadcast |
| HTTP API | `docker/world3d/src/api.ts` | REST endpoints for GraphQL |
| Store | `docker/world3d/src/store.ts` | Three.js scene management |
| Protocol | `docker/world3d/src/protocol.ts` | Message types (S2C_OBJECT_UPDATE) |

## Documentation

- [Player Sync](./player-sync.md) — Player initialization, spawn logic, position sync

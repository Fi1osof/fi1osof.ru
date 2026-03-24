# Agent World — Custom Node

## Location

```
server/n8n/custom-nodes/src/nodes/AgentWorld/
├── AgentWorld.node.ts      # n8n node definition
├── WorldsStore/
│   ├── index.ts            # WorldsStore singleton
│   └── AgentWorld/
│       ├── index.ts        # AgentWorld class
│       └── helpers/
│           ├── userOperations.ts   # upsertUser, getUser
│           ├── nodeOperations.ts   # addNode, updateNode, etc.
│           ├── nodeRead.ts         # read, expandNode
│           └── ...
├── interfaces.ts           # TypeScript interfaces
└── tests/                  # Unit tests
```

## CUSTOM.agentWorld

n8n node for agent world operations.

### Operations

| Operation | Parameters | Description |
|-----------|------------|-------------|
| `read` | `maxDepth`, `expandNodeIds`, `formatAsContext` | Read world |
| `addNode` | `parentNodeId`, `nodeType`, `nodeName`, `nodeData` | Add node |
| `updateNode` | `nodeId`, `nodeName`, `nodeData` | Update node |
| `deleteNode` | `nodeId` | Delete node |
| `moveNode` | `nodeId`, `newParentId` | Move node |
| `expandNode` | `nodeId`, `expandDepth` | Expand node |
| `stats` | — | Storage statistics |
| `upsertUser` | `userId`, `sessionId`, `userName`, `userData` | Create/update user in world |

### Parameters

- **maxDepth** — maximum read depth (default: 2)
- **expandNodeIds** — node IDs for deep expansion (comma-separated)
- **formatAsContext** — format as text for agent context
- **parentNodeId** — parent node ID (use "root" for root)
- **nodeId** — node ID for update/delete/move/expand operations
- **newParentId** — new parent ID for moveNode
- **expandDepth** — expansion depth (default: 3)
- **userId** — user ID from auth system (for upsertUser)
- **sessionId** — session ID for anonymous/authenticated user (for upsertUser)
- **userName** — display name (for upsertUser)
- **userData** — additional user data as JSON (for upsertUser)

## AgentWorld Class

Main world management class.

### Methods

```typescript
class AgentWorld {
  // Getters
  get id(): string
  get root(): WorldNode
  get createdAt(): string
  get updatedAt(): string

  // Operations
  addNode(parentId: string, node: Omit<WorldNode, 'id' | 'meta' | 'children'>): WorldNode
  updateNode(nodeId: string, data: Partial<Pick<WorldNode, 'name' | 'data'>>): WorldNode
  deleteNode(nodeId: string): void
  moveNode(nodeId: string, newParentId: string): WorldNode
  read(options?: ReadOptions): WorldNode
  expandNode(nodeId: string, depth?: number): WorldNode
  
  // User operations
  upsertUser(userData: UserData): WorldNode
  getUser(userId?: string, sessionId?: string): WorldNode | null
  
  // Utilities
  findNode(root: WorldNode, nodeId: string): WorldNode | null
  formatForContext(node?: WorldNode, indent?: number): string
}
```

### ID Generation

Node IDs are auto-generated — 6 HEX characters (uppercase):

```typescript
function generateNodeId(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase()
}
```

### Cycle Protection

When moving a node, it checks that the target parent is not a descendant of the node being moved:

```typescript
moveNode(nodeId: string, newParentId: string): WorldNode {
  // ...
  if (this.isDescendant(node, newParentId)) {
    throw new Error(
      `Cannot move node "${nodeId}" into its descendant "${newParentId}". This would create a cycle.`
    )
  }
  // ...
}
```

## WorldsStore

Singleton in-memory worlds storage.

```typescript
class WorldsStore {
  get(agentId: string, ownerId?: string): AgentWorld | undefined
  getOrCreate(agentId: string, ownerId?: string): AgentWorld
  getStats(): { totalWorlds: number; worldIds: string[] }
}

export const worldsStore = new WorldsStore()
```

## Build

```bash
# When changing file structure — must delete old artifacts!
rm -rf server/n8n/custom-nodes/dist
npm run build:custom-nodes
```

n8n restart required after build.

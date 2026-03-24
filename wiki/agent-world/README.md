# Agent World

Agent's "world" management system — a graph of nodes representing entities the agent knows about.

## Concept

Agent World is a persistent knowledge store for the agent in the form of a hierarchical graph. Each node represents an entity (user, task, article, etc.) with metadata and child nodes.

### Why

- **Agent context** — agent remembers information between sessions
- **Structured knowledge** — hierarchy instead of flat list
- **Attention mechanics** — frequently read nodes get higher priority
- **Isolation** — single global world for all agents (for now)

### Node Types

- **root** — world root node (id: "root")
- **user** — users
- **task** — tasks
- **article** — articles, notes
- Any other types as needed

## Architecture

```
Agent World
├── Custom Node (CUSTOM.agentWorld)
│   ├── AgentWorld.ts — world management class
│   ├── WorldsStore.ts — in-memory worlds storage
│   └── interfaces.ts — data types
├── Tool Workflow (Tool: Agent World)
│   └── Calls CUSTOM.agentWorld
└── Agent Workflow (Agent World)
    └── AI agent with world management tools
```

## Operations

| Operation | Description |
|-----------|-------------|
| `read` | Read world with depth control |
| `addNode` | Add node (ID auto-generated) |
| `updateNode` | Update node |
| `deleteNode` | Delete node |
| `moveNode` | Move node to another parent |
| `expandNode` | Expand node to greater depth |

## Node Metadata

Each node contains:
- `id` — unique identifier (6 HEX characters, auto-generated)
- `type` — node type
- `name` — display name
- `data` — arbitrary data (JSON)
- `meta` — system metadata:
  - `createdAt` — creation date
  - `updatedAt` — last modification date
  - `lastReadAt` — last read date
  - `readCount` — read counter
  - `depthLevel` — depth level for attention mechanics

## Attention Mechanics

When a node is read frequently (`readCount > 5`), its `depthLevel` automatically increases, allowing its child nodes to be read deeper on subsequent requests.

## Files

- [Data Structures](./data-structures.md)
- [Custom Node](./custom-node.md)
- [Workflows](./workflows.md)

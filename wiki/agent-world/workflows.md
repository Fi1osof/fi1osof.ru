# Agent World — Workflows

## Location

```
server/n8n/workflows/
├── agent-world/           # AI agent for world management
│   ├── factory.ts         # Workflow generator
│   ├── helpers.ts         # Helpers
│   ├── systemMessage.md   # System prompt
│   └── prepareContext.js  # Context preparation
└── tool-agent-world/      # Tool workflow for operations
    ├── factory.ts         # Workflow generator
    └── helpers.ts         # Helpers
```

## Tool: Agent World

Workflow for world operations. Called by tools from Agent World.

### Structure

```
Execute Workflow Trigger → CUSTOM.agentWorld
```

### Input Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `operation` | string | Operation: read, addNode, updateNode, deleteNode, moveNode |
| `maxDepth` | number | Read depth |
| `expandNodeIds` | string | Node IDs for expansion |
| `parentNodeId` | string | Parent ID for addNode |
| `nodeId` | string | Node ID for update/delete/move |
| `nodeType` | string | Node type for addNode |
| `nodeName` | string | Node name |
| `nodeData` | string | Node JSON data |
| `newParentId` | string | New parent for moveNode |
| `expandDepth` | number | Expansion depth |

## Agent World

AI agent with world management tools.

### Structure

```
Chat Trigger ─┬─→ Merge → Prepare Context → World Agent
Exec Trigger ─┘                               ↑
                                    Chat Model ┘
                                    Read World Tool ┘
                                    Add Node Tool ┘
                                    Update Node Tool ┘
                                    Delete Node Tool ┘
                                    Move Node Tool ┘
```

### Tools

Each tool calls `Tool: Agent World` with a fixed operation:

| Tool | Operation | AI Parameters |
|------|-----------|---------------|
| `read_world` | read | maxDepth, expandNodeIds |
| `add_node` | addNode | parentNodeId, nodeType, nodeName, nodeData |
| `update_node` | updateNode | nodeId, nodeName, nodeData |
| `delete_node` | deleteNode | nodeId |
| `move_node` | moveNode | nodeId, newParentId |

### Parameter Separation

The `operation` parameter is static (hardcoded in tool), others are available to AI via `$fromAI()`:

```typescript
const staticInputs = createStaticInputs([
  { name: 'operation', value: 'addNode', type: 'string', required: true },
])
const aiInputs = createToolInputs([
  { name: 'parentNodeId', description: '...', type: 'string', required: true },
  // ...
])
```

## Configuration

Agent model is configured via environment variable:

```bash
AGENT_WORLD_MODEL=google/gemini-2.5-flash-lite
```

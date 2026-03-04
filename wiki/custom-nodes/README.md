# Custom Nodes

## Location

```
server/n8n/custom-nodes/
├── src/nodes/
│   ├── AgentOrchestrator/    # Main AI agent node
│   └── ToolCallsMemory/       # Tool calls history storage
├── package.json
└── tsconfig.json
```

## AgentOrchestrator

Full AI agent with tool execution loop. See [detailed documentation](./agent-orchestrator.md).

- Direct OpenAI SDK integration
- Streaming support (can be disabled for server-to-server requests)
- Multi-iteration tool execution
- Credentials: `openRouterApi`

## ToolCallsMemory

In-memory storage for tool execution history with query capabilities.

- **Operations:** add, query, stats
- **Storage:** In-memory Map keyed by `workflowId`
- **Usage:** Automatic recording in AgentOrchestrator, queried by Memory Recall agent
- **Isolation:** Each workflow sees only its own tool call history

See [Memory Recall documentation](../workflows/memory-recall.md) for details.

## Development

```bash
cd server/n8n/custom-nodes && npm run build
```

# Agent Documentation

## Contents

- [Agent Philosophy](./agent-philosophy.md) — what you get, core principles, ideology
- [Technical Overview](./technical-overview.md) — stack, architecture, configuration, manual setup
- [Registration Policy](./registration-policy.md) — referral system, user statuses
- [Code Style](./code-style.md)
- [Custom Nodes](./custom-nodes/README.md)
- [Workflows](./workflows/README.md)
- [Agent World](./agent-world/README.md) — agent knowledge graph
- [Testing](./testing/README.md)
- [Mail Server](./mailserver/README.md)
- [World3D](./world3d/README.md) — multiplayer 3D environment
- [Local LLM Server](./llama-server/README.md) — llama.cpp with CUDA (requires NVIDIA GPU)
- [LLM Client](./llm-client/README.md) — direct LLM access via GraphQL and TypeScript
- [Skills](./skills/README.md) — file-based agent skills catalog with optional executables
- [Computer Vision](./computer-vision/README.md) — image recognition with Qwen3.5 vision model
- [Jinja Templates](./jinja-templates/README.md) — chat templates for LLM

## Architecture

```
Express Server
├── GraphQL API (Pothos + Prisma)
└── n8n Integration
    ├── Custom Nodes (AgentOrchestrator)
    └── Workflows (agent-factory)
```

## Agents

- **Chat Agent** — Main user interface
- **Web Search Agent** — Internet search (Perplexity, authenticated users only)

## Custom Nodes

Located in `server/n8n/custom-nodes/`:
- **AgentOrchestrator** — AI agent with OpenAI SDK integration
- **ToolCallsMemory** — In-memory storage for tool execution history
- **AgentWorld** — Agent knowledge graph management

## Workflow Factory

Located in `server/n8n/workflows/agent-factory/`:
- Generates n8n workflows from TypeScript
- `hasTools` flag for models without tool support
- Nodes store with Proxy for convenient access by name (`this.nodes['Node Name']`)
- Custom `systemMessage` via agent credentials (gitignored, allows individual tuning)

## Knowledge Base (KB)

Agent's knowledge storage system with concepts and facts.

### KB Tools (Chat Agent)

Located in `server/n8n/workflows/agent-chat/nodes/`:
- **KB/KBConcept/** — CRUD workflow factories for concepts
- **execTool/tools/KB/** — Tool node definitions for ExecTool proxy

### GraphQL Queries

- `concepts` / `myConcepts` — read concepts with optional `detailedInfo` for content
- `createConcept` / `updateConcept` / `deleteConcept` — mutations

### UI Components

Located in `src/components/pages/KnowledgeBase/View/`:
- **ConceptCard** — concept display with nested facts
- **FactCard** — fact display with participations and projections
- **ParticipationCard** / **ProjectionCard** / **SpaceCard** — nested entity cards

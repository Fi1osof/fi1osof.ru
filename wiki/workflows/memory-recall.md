# Memory Recall Agent

AI-powered semantic search through tool execution history.

## Overview

Memory Recall is a specialized agent that tracks all tool calls across workflows and provides natural language search over this history. It enables agents to recall previous actions, parameters, and results from earlier in the conversation or across sessions.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Memory Recall System                   │
├─────────────────────────────────────────────────────────┤
│  1. Tool Execution (any agent)                          │
│     └─► ToolCallsMemory.add() → in-memory store         │
│                                                          │
│  2. Query (via Memory Recall agent or tool)             │
│     └─► ToolCallsMemory.query() → formatted history     │
│     └─► LLM analyzes → natural language response        │
└─────────────────────────────────────────────────────────┘
```

## Components

### 1. ToolCallsMemory Node

Custom n8n node for storing and querying tool call records.

**Location:** `server/n8n/custom-nodes/src/nodes/ToolCallsMemory/`

**Operations:**
- `add` — Record a tool call with metadata
- `query` — Retrieve records with optional filtering
- `stats` — Get statistics about stored records

**Storage:** In-memory Map, keyed by `workflowId` for isolation.

### 2. Memory Store

**Location:** `server/n8n/custom-nodes/src/nodes/ToolCallsMemory/helpers/toolCallsMemory.ts`

**Record structure:**
```typescript
{
  timestamp: string
  workflowId: string
  agentId: string
  agentName: string
  sessionId: string
  toolName: string
  toolArguments: Record<string, unknown>
  toolResult: string
  userId?: string
}
```

### 3. Memory Recall Workflow

**Location:** `server/n8n/workflows/memory-recall/`

Standalone agent workflow that:
1. Accepts natural language queries via chat or Execute Workflow
2. Queries tool calls history for the requesting workflow
3. Formats history as system message
4. Uses LLM to analyze and answer questions

**Model:** `google/gemini-2.5-flash-lite` (fast model for search)

### 4. Memory Recall Tool

**Location:** `server/n8n/workflows/agent-factory/tools/memoryRecall/`

Tool that agents can use to query their own execution history.

**Parameters:**
- `chatInput` — What to search for (AI-generated)
- `sessionId` — Current session (auto-passed)
- `workflowId` — Current workflow (auto-passed)
- `skipMemoryRecording` — Don't record this query itself

## Integration

### Automatic Recording

All tool executions are automatically recorded in `executeFullMode.ts`:

```typescript
// After tool execution
if (!skipMemoryRecording) {
  toolCallsMemory.addToolCall({
    timestamp: new Date().toISOString(),
    workflowId: workflow.id,
    agentId,
    agentName,
    sessionId,
    toolName,
    toolArguments,
    toolResult,
    userId,
  })
}
```

### Enabling for Agents

Add to agent config:

```typescript
{
  hasMemoryRecall: true,
}
```

Or in agent credentials file:

```json
{
  "agentName": "Chat Agent",
  "hasMemoryRecall": true
}
```

## Privacy & Context Awareness

The Memory Recall agent has access to **all tool calls** within a workflow, across all users and sessions. However:

- **Workflow isolation** — Each workflow only sees its own history
- **Context-aware** — Agent receives current `sessionId` and `userId` as context
- **Privacy-preserving** — Agent can show aggregated patterns but must not expose details from other users' sessions
- **Prioritization** — Agent should prioritize information from the current user's session when relevant

## Usage Examples

### Via Chat

User can chat directly with Memory Recall agent:

```
User: "What files did I read in the last hour?"
Agent: [searches tool calls history and responds]
```

### Via Tool (from another agent)

Chat Agent can use Memory Recall tool:

```
User: "What did you do earlier?"
Chat Agent: [calls memory_recall tool]
Memory Recall: [returns formatted answer]
Chat Agent: [presents to user]
```

## Query Filtering

- **By workflow** — `filterWorkflowId` (primary isolation)
- **Limit** — Last N records (default: 50)
- **Format** — Optional markdown formatting for LLM consumption

## System Prompt

The Memory Recall agent is instructed to:
- Analyze user queries to understand information needs
- Review provided tool calls history across ALL users and sessions
- Extract and present relevant information clearly
- Answer based ONLY on provided history, no assumptions
- Share aggregated patterns across users when relevant
- NOT expose specific details of other users' sessions to current user
- Prioritize information from current user's session when relevant

## Environment Variables

```env
AGENT_FAST_MEMORY_MODEL=google/gemini-2.5-flash-lite
```

## Limitations

- **In-memory only** — Data lost on restart (no persistence)
- **No semantic search** — Simple filtering, LLM does the analysis
- **Workflow-scoped** — Cannot search across different workflows
- **No time-based queries** — Records include timestamps but no time-range filtering yet

## Future Enhancements

- Persistent storage (database)
- Vector embeddings for semantic search
- Time-range filtering
- Cross-workflow search (with proper access control)
- Automatic summarization of long histories

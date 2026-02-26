# Workflows

n8n workflow definitions in TypeScript.

## Documentation

- [Bootstrap](./bootstrap/README.md) — how workflows are loaded and imported
- [Helpers](./helpers/README.md) — helper functions for creating tool nodes
- [Loop Runner](./loop-runner.md) — infinite loop pattern
- [Memory Recall](./memory-recall.md) — tool calls history tracking and search

## Location

```
server/n8n/workflows/
├── interfaces.ts            # WorkflowBase, WorkflowFactory, CredentialsMap
├── helpers/                 # Helper functions
├── agent-factory/           # Core agent factory logic
├── agent-chat/              # Chat Agent
├── agent-web-search/        # Web Search Agent (Perplexity)
├── memory-recall/           # Memory Recall Agent (tool calls history search)
├── telegram-handler/        # Telegram bot handler (WorkflowFactory)
├── mcp-server/              # MCP server handler
├── loop-runner/             # Infinite loop runner
├── loop-handler/            # Loop business logic
├── error-handler/           # Error handling workflow
├── reflection/              # Agent reflection workflow
├── tool-*/                  # Tool workflows
└── verify-token/            # Token verification
```

## Key Options

- `hasTools` — disable for models without tool support (e.g., Perplexity)
- `agentNodeType` — `'orchestrator'` for custom AgentOrchestrator node
- `memorySize` — conversation memory size, `0` to disable
- `authFromToken` — authenticate users from JWT token
- `hasMemoryRecall` — enable Memory Recall tool for searching tool execution history

## Best Practices

### Code Node Input Access

In n8n Code nodes, use `$input.first()` to access input data:

```javascript
const item = $input.first().json

const url = item.url || ''
const method = item.method || 'GET'
```

**Do NOT use:**
- `$json` — only available in "Run Once for Each Item" mode
- `$input.all()[0]` — use `$input.first()` instead

## Agents

| Agent | Model | hasTools |
|-------|-------|----------|
| Chat Agent | claude-opus-4.5 | true |
| Web Search | perplexity/sonar-reasoning-pro | false |

## Tool Node Variables

When creating tool nodes for GraphQL requests, use **yup schemas** for typing and parameter descriptions.

### Structure

Each node has its own `schema.ts` file:

```typescript
// schema.ts
import { CreateTaskMutationVariables } from 'src/gql/generated/createTask'
import * as yup from 'yup'

export const createTaskSchema: yup.ObjectSchema<CreateTaskMutationVariables> =
  yup.object().shape({
    data: yup.object().shape({
      title: yup.string().required().label('Task title'),
      description: yup.string().label('Task description'),
      content: yup.string().label('Detailed task content'),
      startDatePlaning: yup.date().label('Planned start date (ISO format)'),
      endDatePlaning: yup.date().label('Planned end date (ISO format)'),
      parentId: yup.string().label('Parent task ID for subtasks'),
    }),
  })
```

```typescript
// index.ts
import { createTaskSchema } from './schema'

const schemaDescription = JSON.stringify(createTaskSchema.describe(), null, 2)

// In workflowInputs.value
{
  query: createTaskQuery,
  variables: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${schemaDescription}\`, 'json') }}`,
}
```

### Rules

- Create `schema.ts` in each node folder
- Type schemas using `*QueryVariables` / `*MutationVariables` from `src/gql/generated/`
- Use `.label()` to describe fields — this ends up in the `describe()` output
- Use `.required()` for required fields
- For enum fields, use `.oneOf(values).label(\`Field name (${values.join(', ')})\`)`
- Keep the node `description` brief — put parameter details in the schema

## Creating a New Agent

1. Create `server/n8n/workflows/agent-{name}/`
2. Create `index.ts` with `createAgent()` config
3. Create `system-message.md`

## Email Integration

Agents can send and receive emails via docker-mailserver.

### Sending Mail

Add `smtp` config to agent credentials file (`credentials/agents/agent-name.json`):

```json
{
  "agentName": "Chat Agent",
  "smtp": {
    "credentialId": "smtp-agent-chat",
    "credentialName": "SMTP Agent Chat",
    "user": "chat@example.com",
    "password": "mailpass",
    "host": "mailserver",
    "port": 587
  }
}
```

`AgentWorkflowFactory` automatically:
1. Reads `smtp` from agent credentials
2. Sets `canSendMail: true` if smtp is present
3. Creates `tool-send-mail` workflow for the agent
4. Creates mailbox on mailserver via `ensureMailbox()`

### Mailbox Management

Mailboxes are created automatically when agent has `smtp` credentials.

Location: `server/n8n/workflows/tool-send-mail/mailboxManager.ts`

The mailbox config is written to `docker/mailserver/config/postfix-accounts.cf` (mounted as `/app/mailserver-config` in app container).

### Credentials Flow

1. `credentials/agents/agent-name.json` — source credentials with `smtp` config
2. `importAgentCredentials()` — imports SMTP creds into n8n
3. `AgentWorkflowFactory.createWorkflow()` → `createAgent()` → `createToolSendMail()` → `ensureMailbox()`

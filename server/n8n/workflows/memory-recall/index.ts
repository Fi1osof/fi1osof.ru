import { WorkflowFactory, CredentialsMap, WorkflowBase } from '../interfaces'

import { getModel } from '../helpers'

const systemMessage = `You are Memory Recall Agent - specialized in searching through tool calls history.

Your role:
- Analyze user query to understand what information they need
- Review the provided tool calls history across ALL users and sessions
- Extract and present relevant information clearly
- Answer based ONLY on the provided history, do not make assumptions

IMPORTANT — Context awareness:
You will receive the current session ID and user ID of the person asking the question.
This is NOT a filter — you have access to the full history of all users in this agent's workflow.
Use your judgment:
- You MAY share aggregated patterns across users (e.g. "multiple users encountered this issue")
- You MUST NOT expose specific details of other users' sessions to the current user
- When relevant, prioritize information from the current user's session, but do not ignore the broader picture

Be concise and precise. Focus on delivering exactly what was requested.`

const buildSystemMessageCode = `const input = $input.first().json;
const query = input.chatInput || '';
const formattedHistory = input.formattedHistory || 'No tool calls found in history.';
const currentSessionId = input.currentSessionId || null;
const currentUserId = input.currentUserId || null;

const contextNote = [
  currentSessionId ? \`Current session: \${currentSessionId}\` : null,
  currentUserId ? \`Current user: \${currentUserId}\` : 'Current user: anonymous',
].filter(Boolean).join('\\n');

const fullSystemMessage = \`${systemMessage}

# Current Context

\${contextNote}

# Tool Calls History (all sessions)

\${formattedHistory}

# User Query

\${query}\`;

return [{
  json: {
    ...input,
    systemMessage: fullSystemMessage,
    query,
  }
}];`

export function createMemoryRecallWorkflow(): WorkflowBase {
  const model = getModel(
    process.env.AGENT_FAST_MEMORY_MODEL || 'google/gemini-2.5-flash-lite',
  )

  return {
    name: 'Memory Recall',
    active: true,
    versionId: 'memory-recall-v1',
    nodes: [
      {
        parameters: {
          public: true,
          mode: 'webhook',
          availableInChat: true,
          agentName: 'Memory Recall',
          agentDescription:
            'Search through history of tool calls. Ask what you want to find.',
          options: {},
        },
        id: 'chat-trigger',
        name: 'When chat message received',
        type: '@n8n/n8n-nodes-langchain.chatTrigger',
        typeVersion: 1.4,
        position: [240, 200] as const,
        webhookId: 'memory-recall-chat',
      },
      {
        id: 'execute-workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [240, 400] as const,
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'chatInput',
                type: 'string',
              },
              {
                name: 'sessionId',
                type: 'string',
              },
              {
                name: 'workflowId',
                type: 'string',
              },
              {
                name: 'skipMemoryRecording',
                type: 'boolean',
              },
            ],
          },
        },
      },
      {
        id: 'merge-triggers',
        name: 'Merge Triggers',
        type: 'n8n-nodes-base.merge',
        typeVersion: 3,
        position: [460, 300] as const,
        parameters: {},
      },
      {
        id: 'query-memory',
        name: 'Query Memory',
        type: 'CUSTOM.toolCallsMemory',
        typeVersion: 1,
        position: [680, 300] as const,
        parameters: {
          operation: 'query',
          filterWorkflowId: '={{ $json.workflowId || "" }}',
          limit: 50,
          currentSessionId: '={{ $json.sessionId || "" }}',
          currentUserId: '={{ $json.userId || "" }}',
          formatAsSystemMessage: true,
        },
      },
      {
        parameters: {
          jsCode: buildSystemMessageCode,
        },
        id: 'build-system-message',
        name: 'Build System Message',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [900, 300] as const,
      },
      {
        id: 'memory-recall-agent',
        name: 'Memory Recall Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        typeVersion: 3.1,
        position: [1120, 300] as const,
        parameters: {
          options: {
            systemMessage: '={{ $json.systemMessage }}',
            maxIterations: 10,
          },
        },
      },
      {
        parameters: {
          model,
          options: {},
        },
        id: 'chat-model',
        name: 'Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        typeVersion: 1,
        position: [1120, 520] as const,
        credentials: {
          openRouterApi: {
            id: 'FsN0N48lU327xkz6',
            name: 'OpenRouter',
          },
        },
      },
      {
        parameters: {},
        id: 'manual-trigger',
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [240, 520] as const,
      },
      {
        parameters: {
          operation: 'add',
          agentId: 'test-agent-1',
          agentName: 'Test Agent',
          sessionId: 'test-session-001',
          toolName: 'read_file',
          toolArguments: '{"path": "/src/index.ts"}',
          toolResult: 'File content: export default function main() { ... }',
          userId: 'test-user',
        },
        id: 'seed-record-1',
        name: 'Seed Record 1',
        type: 'CUSTOM.toolCallsMemory',
        typeVersion: 1,
        position: [460, 520] as const,
      },
    ],
    connections: {
      'When chat message received': {
        main: [[{ node: 'Merge Triggers', type: 'main', index: 0 }]],
      },
      'Execute Workflow Trigger': {
        main: [[{ node: 'Merge Triggers', type: 'main', index: 1 }]],
      },
      'Merge Triggers': {
        main: [[{ node: 'Query Memory', type: 'main', index: 0 }]],
      },
      'Query Memory': {
        main: [[{ node: 'Build System Message', type: 'main', index: 0 }]],
      },
      'Build System Message': {
        main: [[{ node: 'Memory Recall Agent', type: 'main', index: 0 }]],
      },
      'Chat Model': {
        ai_languageModel: [
          [{ node: 'Memory Recall Agent', type: 'ai_languageModel', index: 0 }],
        ],
      },
      'Manual Trigger': {
        main: [[{ node: 'Seed Record 1', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: 'narasim-dev-memory-recall',
    },
  }
}

export default class MemoryRecallWorkflowFactory extends WorkflowFactory {
  async createWorkflow(_credentials: CredentialsMap): Promise<WorkflowBase> {
    return createMemoryRecallWorkflow()
  }
}

import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../interfaces'

export function getFetchRequestTool(
  config: AgentFactoryConfig,
): NodeType | undefined {
  const { agentId, agentName, canExecuteFetch } = config

  if (!canExecuteFetch) {
    return undefined
  }

  return {
    id: `${agentId}-tool-fetch-request`,
    name: 'Fetch Request Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 1944],
    parameters: {
      name: 'fetch_request',
      description:
        'Execute HTTP request using fetch. Returns status, statusText and body.',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: 'Tool: Fetch Request',
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          url: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('url', 'Full URL starting with http:// or https://', 'string') }}`,
          method: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('method', 'HTTP method: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS', 'string') }}`,
          headers: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('headers', 'Request headers as JSON string', 'string') }}`,
          body: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('body', 'Request body as JSON string for POST/PUT/PATCH requests', 'string') }}`,
        },
        matchingColumns: [],
        schema: [
          {
            id: 'targetWorkflow',
            displayName: 'targetWorkflow',
            required: true,
            defaultMatch: false,
            display: false,
            type: 'string',
            canBeUsedToMatch: false,
          },
          {
            id: 'reasoning',
            displayName: 'reasoning',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'url',
            displayName: 'url',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'method',
            displayName: 'method',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'headers',
            displayName: 'headers',
            required: false,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'body',
            displayName: 'body',
            required: false,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
  }
}

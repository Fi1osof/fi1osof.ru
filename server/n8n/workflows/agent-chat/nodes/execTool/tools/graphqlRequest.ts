import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../interfaces'

export function getGraphqlRequestTool(
  config: AgentFactoryConfig,
): NodeType | undefined {
  const { agentId, agentName, hasGraphqlTool = true } = config

  if (!hasGraphqlTool) {
    return undefined
  }

  return {
    id: `${agentId}-tool-graphql-request`,
    name: 'GraphQL Request Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 2520],
    parameters: {
      name: 'graphql_request',
      description: `Execute a GraphQL query or mutation against the API. IMPORTANT: All requests are authenticated as ${agentName}, not as the external user.`,
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: `Tool: GraphQL Request (${agentName})`,
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          query: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('query', 'GraphQL query or mutation string', 'string') }}`,
          variables: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', 'Variables object for the query, use {} if no variables needed', 'string') }}`,
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
            id: 'query',
            displayName: 'query',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'variables',
            displayName: 'variables',
            required: true,
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

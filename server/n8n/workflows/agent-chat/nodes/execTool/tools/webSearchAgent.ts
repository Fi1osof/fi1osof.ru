import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../interfaces'
import { WebSearchAgentWorkflowName } from 'server/n8n/workflows/agent-web-search/interfaces'

export function getWebSearchAgentTool(
  config: AgentFactoryConfig,
): NodeType | undefined {
  const { agentId, agentName, hasWebSearchAgent } = config

  if (!hasWebSearchAgent) {
    return undefined
  }

  return {
    id: `${agentId}-tool-web-search-agent`,
    name: 'Web Search Agent Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 2136],
    parameters: {
      name: 'web_search_agent',
      description:
        'Delegate web search and research tasks. Use for: internet search, current information, fact-checking, news, fetching web pages. ONLY FOR AUTHENTICATED USERS.',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: WebSearchAgentWorkflowName,
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          chatInput: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('message', 'Message to Web Search Agent Tool', 'string') }}`,
          sessionId: "={{ $('Prepare Context').first().json.sessionId }}",
          user: "={{ $('Prepare Context').first().json.user }}",
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
            id: 'chatInput',
            displayName: 'chatInput',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'sessionId',
            displayName: 'sessionId',
            required: true,
            defaultMatch: false,
            display: false,
            type: 'string',
            canBeUsedToMatch: false,
          },
          {
            id: 'user',
            displayName: 'user',
            required: true,
            defaultMatch: false,
            display: false,
            type: 'string',
            canBeUsedToMatch: false,
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
  }
}

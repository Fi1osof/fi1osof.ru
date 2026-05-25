import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../../../interfaces'

export function getReadConceptsTool(
  config: AgentFactoryConfig,
): NodeType | null {
  const { agentId, agentName, hasGraphqlTool } = config

  if (!hasGraphqlTool) {
    return null
  }

  return {
    id: `${agentId}-tool-read-concepts`,
    name: 'Read Concepts Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 1368],
    parameters: {
      name: 'read_concepts',
      description:
        'Reads all available knowledge. Use when you need to know what you know and can do',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: `Tool: Read Concepts (${agentName})`,
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          ids: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('ids', 'List of concept IDs for filtering. Specify only for selecting specific concepts. In other cases pass an empty string', 'string') }}`,
          detailedInfo: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('detailedInfo', 'Get full information including content. Specify true only when selecting specific concepts by ids. Otherwise pass false', 'boolean') }}`,
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
            id: 'detailedInfo',
            displayName: 'detailedInfo',
            required: false,
            defaultMatch: false,
            display: true,
            type: 'boolean',
            canBeUsedToMatch: true,
          },
          {
            id: 'ids',
            displayName: 'ids',
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

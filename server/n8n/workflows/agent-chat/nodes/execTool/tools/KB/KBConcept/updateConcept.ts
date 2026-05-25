import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../../../interfaces'

export function getUpdateConceptTool(
  config: AgentFactoryConfig,
): NodeType | null {
  const { agentId, agentName, hasGraphqlTool } = config

  if (!hasGraphqlTool) {
    return null
  }

  return {
    parameters: {
      name: 'update_concept',
      description:
        'Updates an existing concept. Use to correct or supplement information',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: `Tool: Update Concept (${agentName})`,
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          id: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('id', 'Concept ID to update', 'string') }}`,
          type: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('type', 'New concept type (optional)', 'string') }}`,
          name: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('name', 'New concept name (optional)', 'string') }}`,
          description: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('description', 'New concept description (optional)', 'string') }}`,
          content: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('content', 'New concept content (optional)', 'string') }}`,
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
            id: 'id',
            displayName: 'id',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'type',
            displayName: 'type',
            required: false,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'name',
            displayName: 'name',
            required: false,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'description',
            displayName: 'description',
            required: false,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'content',
            displayName: 'content',
            required: false,
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
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-update-concept`,
    name: 'Update Concept Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 1560],
  }
}

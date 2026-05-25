import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../../../interfaces'

export function getCreateConceptTool(
  config: AgentFactoryConfig,
): NodeType | null {
  const { agentId, agentName, hasGraphqlTool } = config

  if (!hasGraphqlTool) {
    return null
  }

  return {
    parameters: {
      name: 'create_concept',
      description:
        'Use independently and automatically to save any useful information. Can be split into multiple concepts',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: `Tool: Create Concept (${agentName})`,
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          type: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('type', 'Concept type at your discretion', 'string') }}`,
          name: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('name', 'Concept name', 'string') }}`,
          description: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('description', 'Concept description', 'string') }}`,
          content: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('content', 'Concept content (optional)', 'string') }}`,
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
            id: 'type',
            displayName: 'type',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'name',
            displayName: 'name',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'description',
            displayName: 'description',
            required: true,
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
    id: `${agentId}-tool-create-concept`,
    name: 'Create Concept Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 1176],
  }
}

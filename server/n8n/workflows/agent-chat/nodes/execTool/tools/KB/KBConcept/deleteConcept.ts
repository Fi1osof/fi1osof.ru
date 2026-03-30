import { NodeType } from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { GetExecToolConfig, reasoningTitle } from '../../../interfaces'

export function getDeleteConceptTool(config: GetExecToolConfig): NodeType {
  const { agentId, agentName } = config

  return {
    parameters: {
      name: 'delete_concept',
      description:
        'Удаляет концепт из базы знаний. Используй для удаления устаревшей или неверной информации',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: `Tool: Delete Concept (${agentName})`,
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          id: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('id', 'ID концепта для удаления', 'string') }}`,
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
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-delete-concept`,
    name: 'Delete Concept Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 1752],
  }
}

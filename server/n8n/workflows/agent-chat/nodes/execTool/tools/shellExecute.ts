import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { reasoningTitle } from '../interfaces'

export function getShellExecuteTool(
  config: AgentFactoryConfig,
): NodeType | undefined {
  const { agentId, agentName, canExecuteShell } = config

  if (!canExecuteShell) {
    return undefined
  }

  return {
    id: `${agentId}-tool-shell-execute`,
    name: 'Shell Execute Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [3070, 2144],
    parameters: {
      name: 'shell_execute',
      description:
        'Execute shell command. Returns stdout, stderr and exit code.',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: 'Tool: Shell Execute',
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          command: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('command', 'Shell command to execute', 'string') }}`,
          cwd: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('cwd', 'Working directory (optional)', 'string') }}`,
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
            id: 'command',
            displayName: 'command',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'cwd',
            displayName: 'cwd',
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

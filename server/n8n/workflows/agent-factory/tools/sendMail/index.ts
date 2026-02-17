import { createTool, createToolInputs } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'
import { getSendMailWorkflowName } from '../../../tool-send-mail/helpers'

interface SendMailToolsConfig {
  agentId: string
  agentName: string
}

export function getSendMailNodes(config: SendMailToolsConfig): NodeType[] {
  const { agentId, agentName } = config

  return [
    createTool({
      name: 'send_mail',
      toolName: 'Send Mail Tool',
      description:
        'Send an email. Use this tool to send emails to users or external recipients.',
      workflowName: getSendMailWorkflowName(agentName),
      nodeId: `${agentId}-tool-send-mail`,
      position: getNodeCoordinates('tool-send-mail'),
      inputs: createToolInputs([
        {
          name: 'to',
          description: 'Recipient email address',
          type: 'string',
          required: true,
        },
        {
          name: 'subject',
          description: 'Email subject line',
          type: 'string',
          required: true,
        },
        {
          name: 'body',
          description: 'Email body content (plain text or HTML)',
          type: 'string',
          required: true,
        },
        {
          name: 'html',
          description:
            'Set to true if body contains HTML, false for plain text',
          type: 'boolean',
        },
      ]),
    }),
  ]
}

export function getSendMailConnections(
  config: SendMailToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Send Mail Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}

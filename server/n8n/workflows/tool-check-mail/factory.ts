import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { getCheckMailWorkflowName } from './helpers'
import { getAgentDataNode } from '../agent-factory/nodes/baseNodes/getAgentDataNode'

const formatMessagesCode = fs.readFileSync(
  path.join(__dirname, 'formatMessages.js'),
  'utf-8',
)

export interface ToolCheckMailConfig {
  agentName: string
  agentWorkflowName: string
  imapCredentialId: string
  imapCredentialName: string
}

export function createToolCheckMail(cfg: ToolCheckMailConfig): WorkflowBase {
  const { agentName, agentWorkflowName, imapCredentialId, imapCredentialName } =
    cfg

  const agentDataNode = getAgentDataNode({
    nodeId: `check-mail-${agentName.toLowerCase().replace(/\s+/g, '-')}-get-agent-data`,
    agentName,
    position: [0, 300],
  })

  return {
    name: getCheckMailWorkflowName(agentName),
    active: true,
    versionId: `tool-check-mail-${agentName.toLowerCase().replace(/\s+/g, '-')}-v2`,
    nodes: [
      {
        id: 'imap-trigger',
        name: 'Email Trigger',
        type: 'n8n-nodes-base.emailReadImap',
        typeVersion: 2,
        position: [-400, 300],
        credentials: {
          imap: {
            id: imapCredentialId,
            name: imapCredentialName,
          },
        },
        parameters: {},
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [-400, 500],
        id: 'manual-trigger',
        name: 'Manual Trigger',
      },
      agentDataNode,
      {
        parameters: {
          jsCode: formatMessagesCode,
        },
        id: 'format-messages',
        name: 'Format Messages',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [400, 300],
      },
      {
        parameters: {
          workflowId: {
            __rl: true,
            mode: 'list',
            value: agentWorkflowName,
          },
          workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
              chatInput: '={{ $json.chatInput }}',
              user: '={{ $json.user }}',
            },
            matchingColumns: [],
            schema: [
              {
                id: 'chatInput',
                displayName: 'chatInput',
                required: true,
                defaultMatch: false,
                display: true,
                canBeUsedToMatch: true,
                type: 'string',
              },
              {
                id: 'user',
                displayName: 'user',
                required: false,
                defaultMatch: false,
                display: true,
                canBeUsedToMatch: true,
                type: 'object',
              },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
          },
        },
        id: 'call-agent',
        name: 'Call Agent',
        type: 'n8n-nodes-base.executeWorkflow',
        typeVersion: 1.2,
        position: [800, 300],
      },
    ],
    connections: {
      'Email Trigger': {
        main: [[{ node: agentDataNode.name, type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: agentDataNode.name, type: 'main', index: 0 }]],
      },
      [agentDataNode.name]: {
        main: [[{ node: 'Format Messages', type: 'main', index: 0 }]],
      },
      'Format Messages': {
        main: [[{ node: 'Call Agent', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: `narasim-dev-tool-check-mail-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

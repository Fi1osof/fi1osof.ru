import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { createHandleResponseNode } from '../helpers'
import { getSendMailWorkflowName } from './helpers'
import { ensureMailbox } from './mailboxManager'

const parseInputCode = fs.readFileSync(
  path.join(__dirname, 'parseInput.js'),
  'utf-8',
)

const mergeConfigTemplate = fs.readFileSync(
  path.join(__dirname, 'mergeConfig.js'),
  'utf-8',
)

const config = {
  SMTP_HOST: process.env.SMTP_HOST || 'mailserver',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'noreply@localhost',
  FROM_NAME: process.env.SMTP_FROM_NAME || 'Agent',
}

export interface ToolSendMailConfig {
  agentName: string
  credentialId: string
  credentialName: string
  fromEmail: string
  fromPassword?: string
}

export function createToolSendMail(cfg: ToolSendMailConfig): WorkflowBase {
  const { agentName, credentialId, credentialName, fromEmail, fromPassword } =
    cfg

  if (fromEmail && fromPassword) {
    ensureMailbox({ email: fromEmail, password: fromPassword })
  } else {
    console.warn(`[${agentName}] fromEmail or fromPassword is emtry. Skip`)
  }

  const agentConfig = {
    ...config,
    FROM_EMAIL: fromEmail,
  }

  const mergeConfigCode = mergeConfigTemplate.replace(
    '$config',
    JSON.stringify(agentConfig, null, 2),
  )

  return {
    name: getSendMailWorkflowName(agentName),
    active: true,
    versionId: `tool-send-mail-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'to',
                type: 'string',
              },
              {
                name: 'subject',
                type: 'string',
              },
              {
                name: 'body',
                type: 'string',
              },
              {
                name: 'html',
                type: 'boolean',
                default: true,
              },
            ],
          },
        },
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [-400, 300],
      },
      {
        parameters: {
          jsCode: parseInputCode,
        },
        id: 'parse-input',
        name: 'Parse Input',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [0, 300],
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [-400, 500],
        id: 'manual-trigger',
        name: 'Manual Trigger',
      },
      {
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'to',
                name: 'to',
                value: 'test@example.com',
                type: 'string',
              },
              {
                id: 'subject',
                name: 'subject',
                value: 'Test Email from Agent',
                type: 'string',
              },
              {
                id: 'body',
                name: 'body',
                value: 'This is a test email sent by the agent.',
                type: 'string',
              },
              {
                id: 'html',
                name: 'html',
                value: '=true',
                type: 'boolean',
              },
            ],
          },
          options: {},
        },
        id: 'set-test-input',
        name: 'Set Test Input',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [0, 500],
      },
      {
        parameters: {
          jsCode: mergeConfigCode,
        },
        id: 'merge-config',
        name: 'Merge Config',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [400, 300],
      },
      {
        parameters: {
          fromEmail: '={{ $json.fromEmail }}',
          toEmail: '={{ $json.to }}',
          subject: '={{ $json.subject }}',
          emailType: '={{ $json.html ? "html" : "text" }}',
          message: '={{ $json.body }}',
          options: {
            senderName: '={{ $json.fromName }}',
          },
        },
        id: 'send-email',
        name: 'Send Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2.1,
        position: [800, 300],
        credentials: {
          smtp: {
            id: credentialId,
            name: credentialName,
          },
        },
        onError: 'continueRegularOutput',
      },
      createHandleResponseNode({
        nodeId: 'handle-response',
        position: [1200, 300],
      }),
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Parse Input', type: 'main', index: 0 }]],
      },
      'Parse Input': {
        main: [[{ node: 'Merge Config', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Merge Config', type: 'main', index: 0 }]],
      },
      'Merge Config': {
        main: [[{ node: 'Send Email', type: 'main', index: 0 }]],
      },
      'Send Email': {
        main: [[{ node: 'Handle Response', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: `narasim-dev-tool-send-mail-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

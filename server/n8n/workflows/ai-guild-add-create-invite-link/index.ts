import { CredentialsMap, WorkflowBase, WorkflowFactory } from '../interfaces'

const workflowName = 'AI-Guild Create Invite Link'

export class AiGuildAddUserToGroupWorkflow extends WorkflowFactory {
  credentialId = 'telegram-ai-guild-main-bot'

  async createWorkflow(credentials: CredentialsMap): Promise<WorkflowBase> {
    let mainPrivateGroup: string | undefined

    const telegramCreds = credentials[this.credentialId]

    if (!telegramCreds) {
      console.warn(
        `Telegram credentials '${this.credentialId}' not found in credentials map`,
      )
    } else if (telegramCreds.type !== 'telegramApi') {
      console.warn(
        `Telegram credentials '${this.credentialId}' is not a telegramApi type`,
      )
    } else {
      const data = telegramCreds.data as Record<string, unknown> | undefined
      mainPrivateGroup = data?.mainPrivateGroup as string | undefined
    }

    if (!mainPrivateGroup) {
      console.warn(
        `Telegram credentials '${this.credentialId}' missing 'mainPrivateGroup' in data`,
      )
    }

    return {
      name: workflowName,
      active: true,
      versionId: 'add-user-to-group-v1',
      nodes: [
        {
          parameters: {
            workflowInputs: {
              values: [
                {
                  name: 'username',
                  type: 'string',
                },
              ],
            },
          },
          type: 'n8n-nodes-base.executeWorkflowTrigger',
          typeVersion: 1.1,
          position: [0, 0],
          id: 'add-user-to-group-trigger',
          name: 'Execute Workflow Trigger',
        },
        {
          parameters: {},
          type: 'n8n-nodes-base.manualTrigger',
          typeVersion: 1,
          position: [0, 200],
          id: 'manual-trigger',
          name: 'Manual Trigger',
        },
        {
          id: 'set-test-input',
          name: 'Set Test Input',
          type: 'n8n-nodes-base.set',
          typeVersion: 3.4,
          position: [200, 200],
          parameters: {
            mode: 'manual',
            duplicateItem: false,
            assignments: {
              assignments: [
                {
                  id: 'username',
                  name: 'username',
                  value: '@ksenia_matveeva',
                  type: 'string',
                },
              ],
            },
            options: {},
          },
        },
        {
          parameters: {
            jsCode: `let username = '';
if ($('Execute Workflow Trigger').isExecuted) {
  username = $('Execute Workflow Trigger').first().json.username || '';
} else if ($('Set Test Input').isExecuted) {
  username = $('Set Test Input').first().json.username || '';
}
return { username };`,
          },
          id: 'prepare-input',
          name: 'Prepare Input',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [400, 0],
        },
        {
          parameters: {
            workflowId: {
              __rl: true,
              value: 'AI-Guild Telegram Bot API',
              mode: 'list',
            },
            workflowInputs: {
              mappingMode: 'defineBelow',
              value: {
                method: 'createChatInviteLink',
                body: `={{ { chat_id: "${mainPrivateGroup || ''}", member_limit: 1, creates_join_request: false } }}`,
              },
              matchingColumns: [],
              schema: [
                {
                  id: 'method',
                  displayName: 'method',
                  required: true,
                  defaultMatch: false,
                  display: true,
                  canBeUsedToMatch: true,
                  type: 'string',
                },
                {
                  id: 'body',
                  displayName: 'body',
                  required: true,
                  defaultMatch: false,
                  display: true,
                  canBeUsedToMatch: true,
                  type: 'object',
                },
              ],
              attemptToConvertTypes: false,
              convertFieldsToString: true,
            },
            options: {},
          },
          type: 'n8n-nodes-base.executeWorkflow',
          typeVersion: 1.3,
          position: [600, 0],
          id: 'call-telegram-bot-api',
          name: 'Call Telegram Bot API',
        },
      ],
      connections: {
        'Execute Workflow Trigger': {
          main: [[{ node: 'Prepare Input', type: 'main', index: 0 }]],
        },
        'Manual Trigger': {
          main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
        },
        'Set Test Input': {
          main: [[{ node: 'Prepare Input', type: 'main', index: 0 }]],
        },
        'Prepare Input': {
          main: [[{ node: 'Call Telegram Bot API', type: 'main', index: 0 }]],
        },
      },
      pinData: {},
      meta: {
        instanceId:
          'b395e642078f5ed10edbf1c29001e3a2243f8ee6445e6cb97bb7046023115b31',
      },
    }
  }
}

export default AiGuildAddUserToGroupWorkflow

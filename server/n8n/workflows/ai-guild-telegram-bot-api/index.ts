import { CredentialsMap, WorkflowBase, WorkflowFactory } from '../interfaces'

const workflowName = 'AI-Guild Telegram Bot API'

export class AiGuildTelegramBotApiWorkflow extends WorkflowFactory {
  credentialId = 'telegram-ai-guild-main-bot'

  async createWorkflow(credentials: CredentialsMap): Promise<WorkflowBase> {
    let accessToken: string | undefined

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
      accessToken = data?.accessToken as string | undefined
    }

    if (!accessToken) {
      console.warn(
        `Telegram credentials '${this.credentialId}' missing 'accessToken' in data`,
      )
    }

    return {
      name: workflowName,
      active: true,
      versionId: 'telegram-bot-api-v1',
      nodes: [
        {
          parameters: {
            workflowInputs: {
              values: [
                {
                  name: 'method',
                  type: 'string',
                },
                {
                  name: 'body',
                  type: 'object',
                },
              ],
            },
          },
          type: 'n8n-nodes-base.executeWorkflowTrigger',
          typeVersion: 1.1,
          position: [0, 0],
          id: 'telegram-bot-api-trigger',
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
                  id: 'method',
                  name: 'method',
                  value: 'getMe',
                  type: 'string',
                },
                {
                  id: 'body',
                  name: 'body',
                  value: '={}',
                  type: 'object',
                },
              ],
            },
            options: {},
          },
        },
        {
          parameters: {
            jsCode: `let method = '';
let body = {};
if ($('Execute Workflow Trigger').isExecuted) {
  method = $('Execute Workflow Trigger').first().json.method || '';
  body = $('Execute Workflow Trigger').first().json.body || {};
} else if ($('Set Test Input').isExecuted) {
  method = $('Set Test Input').first().json.method || '';
  body = $('Set Test Input').first().json.body || {};
}
return { method, body };`,
          },
          id: 'prepare-input',
          name: 'Prepare Input',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [400, 0],
        },
        {
          parameters: {
            method: 'POST',
            url: accessToken
              ? `=https://api.telegram.org/bot${accessToken}/{{ $json.method }}`
              : undefined,
            sendBody: true,
            specifyBody: 'json',
            jsonBody: '={{ JSON.stringify($json.body) }}',
            options: {},
          },
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.2,
          position: [600, 0],
          id: 'telegram-api-request',
          name: 'Telegram API Request',
          onError: 'continueRegularOutput',
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
          main: [[{ node: 'Telegram API Request', type: 'main', index: 0 }]],
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

export default AiGuildTelegramBotApiWorkflow

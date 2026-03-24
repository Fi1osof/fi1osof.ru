import { WorkflowBase } from '../interfaces'

const toolUpsertUser: WorkflowBase = {
  name: 'Tool: Upsert User',
  active: true,
  versionId: 'tool-upsert-user-v1',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'userId',
              type: 'string',
            },
            {
              name: 'sessionId',
              type: 'string',
            },
            {
              name: 'userName',
              type: 'string',
            },
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [240, 300],
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [240, 500],
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
              id: 'sessionId',
              name: 'sessionId',
              value: 'test-session-123',
              type: 'string',
            },
            {
              id: 'userId',
              name: 'userId',
              value: '',
              type: 'string',
            },
            {
              id: 'userName',
              name: 'userName',
              value: 'Test User',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-test-input',
      name: 'Set Test Input',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [460, 500],
    },
    {
      parameters: {
        operation: 'upsertUser',
        userId: '={{ $json.userId || "" }}',
        sessionId: '={{ $json.sessionId || "" }}',
        userName: '={{ $json.userName || "" }}',
        userData: '={{ JSON.stringify({}) }}',
      },
      id: 'upsert-user',
      name: 'Upsert User',
      type: 'CUSTOM.agentWorld',
      typeVersion: 1,
      position: [680, 300],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Upsert User', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
    },
    'Set Test Input': {
      main: [[{ node: 'Upsert User', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-upsert-user',
  },
}

export default [toolUpsertUser]

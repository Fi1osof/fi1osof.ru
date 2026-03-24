import { WorkflowBase } from '../interfaces'

const toolAddConversation: WorkflowBase = {
  name: 'Tool: Add Conversation',
  active: true,
  versionId: 'tool-add-conversation-v1',
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
              name: 'chatInput',
              type: 'string',
            },
            {
              name: 'response',
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
              id: 'chatInput',
              name: 'chatInput',
              value: 'Hello, how are you?',
              type: 'string',
            },
            {
              id: 'response',
              name: 'response',
              value: 'I am doing well, thank you!',
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
        operation: 'addConversation',
        convUserId: '={{ $json.userId || "" }}',
        convSessionId: '={{ $json.sessionId || "" }}',
        chatInput: '={{ $json.chatInput || "" }}',
        response: '={{ $json.response || "" }}',
      },
      id: 'add-conversation',
      name: 'Add Conversation',
      type: 'CUSTOM.agentWorld',
      typeVersion: 1,
      position: [680, 300],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Add Conversation', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
    },
    'Set Test Input': {
      main: [[{ node: 'Add Conversation', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-add-conversation',
  },
}

export default [toolAddConversation]

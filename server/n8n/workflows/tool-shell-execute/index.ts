import { WorkflowBase } from '../interfaces'

const workflow: WorkflowBase = {
  name: 'Tool: Shell Execute',
  active: true,
  versionId: 'tool-shell-execute-v1',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'command',
              type: 'string',
            },
            {
              name: 'cwd',
              type: 'string',
            },
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [-200, 304],
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [-200, 504],
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
              id: 'command',
              name: 'command',
              value: 'echo "Hello World"',
              type: 'string',
            },
            {
              id: 'cwd',
              name: 'cwd',
              value: '/tmp',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-test-data',
      name: 'Set Test Data',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [0, 504],
    },
    {
      parameters: {
        command: '={{ $json.command }}',
        cwd: '={{ $json.cwd || "/" }}',
      },
      id: 'execute-command',
      name: 'Execute Command',
      type: 'n8n-nodes-base.executeCommand',
      typeVersion: 1,
      position: [200, 304],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Execute Command', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
    },
    'Set Test Data': {
      main: [[{ node: 'Execute Command', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-shell-execute',
  },
}

export default workflow

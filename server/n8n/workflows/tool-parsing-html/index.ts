import { WorkflowBase } from '../interfaces'

const workflow: WorkflowBase = {
  name: 'Tool: Parsing HTML',
  active: true,
  versionId: 'tool-parsing-html-v1',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'url',
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
              id: 'url',
              name: 'url',
              value: 'https://haih.net',
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
        url: '={{ $json.url }}',
        options: {},
        requestOptions: {},
      },
      id: 'jina-reader',
      name: 'Jina Reader',
      type: 'n8n-nodes-base.jinaAi',
      typeVersion: 1,
      position: [200, 304],
      credentials: {
        jinaAiApi: {
          id: 'jina-api',
          name: 'Jina AI account',
        },
      },
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Jina Reader', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
    },
    'Set Test Data': {
      main: [[{ node: 'Jina Reader', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-parsing-html',
  },
}

export default workflow

import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'

const buildCommandCode = fs.readFileSync(
  path.join(__dirname, 'buildCommand.js'),
  'utf-8',
)

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
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [-350, 510],
      id: 'manual-trigger',
      name: 'Manual Trigger',
      parameters: {},
    },
    {
      id: 'set-test-data',
      name: 'Set Test Data',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [-144, 512],
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
    },
    {
      parameters: {
        jsCode: buildCommandCode,
      },
      id: 'build-command',
      name: 'Build Command',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [100, 304],
    },
    {
      parameters: {
        executeOnce: true,
        command: '={{ $json.command }}',
      },
      id: 'execute-command',
      name: 'Execute Command',
      type: 'n8n-nodes-base.executeCommand',
      typeVersion: 1,
      position: [300, 304],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Build Command', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
    },
    'Set Test Data': {
      main: [[{ node: 'Build Command', type: 'main', index: 0 }]],
    },
    'Build Command': {
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

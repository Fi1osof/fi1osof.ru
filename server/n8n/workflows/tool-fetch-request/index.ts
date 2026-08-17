import fs from 'fs'
import path from 'path'
import { WorkflowBase } from '../interfaces'

const fetchRequestCode = fs.readFileSync(
  path.join(__dirname, 'fetchRequest.js'),
  'utf-8',
)

const parseInputCode = fs.readFileSync(
  path.join(__dirname, 'parseInput.js'),
  'utf-8',
)

const workflow: WorkflowBase = {
  name: 'Tool: Fetch Request',
  active: true,
  versionId: 'tool-fetch-request-v2',
  nodes: [
    {
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'url',
              type: 'string',
            },
            {
              name: 'method',
              type: 'string',
            },
            {
              name: 'headers',
              type: 'any',
            },
            {
              name: 'body',
              type: 'any',
            },
          ],
        },
      },
      position: [-208, 304],
    },
    {
      id: 'manual-trigger',
      name: 'Manual Trigger',
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [-432, 544],
      parameters: {},
    },
    {
      id: 'set-test-data',
      name: 'Set Test Data',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'url',
              name: 'url',
              value: 'https://agent.haih.net/api',
              type: 'string',
            },
            {
              id: 'method',
              name: 'method',
              value: 'POST',
              type: 'string',
            },
            {
              id: 'headers',
              name: 'headers',
              value: '{}',
              type: 'string',
            },
            {
              id: 'body',
              name: 'body',
              value: `{"query": "query posts { posts (take: 5) { id, createdAt, title, intro }}"}`,
              type: 'string',
            },
          ],
        },
        options: {},
      },
      position: [-224, 544],
    },
    {
      id: 'fetch-request',
      name: 'Fetch Request',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      parameters: {
        jsCode: fetchRequestCode,
      },
      position: [208, 304],
    },
    {
      id: 'parse-input',
      name: 'Parse Input',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      parameters: {
        jsCode: parseInputCode,
      },
      position: [16, 304],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Parse Input', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
    },
    'Set Test Data': {
      main: [[{ node: 'Parse Input', type: 'main', index: 0 }]],
    },
    'Parse Input': {
      main: [[{ node: 'Fetch Request', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-fetch-request',
  },
}

export default workflow

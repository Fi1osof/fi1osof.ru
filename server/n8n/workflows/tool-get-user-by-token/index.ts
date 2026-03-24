import * as fs from 'fs'
import * as path from 'path'
import { print } from 'graphql'
import { MeDocument } from 'src/gql/generated/me'
import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const combineOutputCode = fs.readFileSync(
  path.join(__dirname, 'combineOutput.js'),
  'utf-8',
)

if (!process.env.GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required')
}

const testUserToken = process.env.TEST_USER_TOKEN || ''

const getUserDataQuery = print(MeDocument)

const toolGetUserByToken: WorkflowBase = {
  name: 'Tool: Get User By Token',
  active: true,
  versionId: 'tool-get-user-by-token-v1',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'token',
              type: 'string',
            },
            {
              name: 'sessionId',
              type: 'string',
            },
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: getNodeCoordinates('tool-get-user-by-token-trigger'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('tool-get-user-by-token-manual'),
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
              id: 'token',
              name: 'token',
              value: testUserToken,
              type: 'string',
            },
            {
              id: 'sessionId',
              name: 'sessionId',
              value: 'test-session-123',
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
      position: getNodeCoordinates('tool-get-user-by-token-set-test'),
    },
    {
      parameters: {
        jsCode: `let token = '';
let sessionId = '';
// @ts-ignore isExecuted is a valid boolean property in n8n runtime
if ($('Execute Workflow Trigger').isExecuted) {
  token = $('Execute Workflow Trigger').first().json.token || '';
  sessionId = $('Execute Workflow Trigger').first().json.sessionId || '';
// @ts-ignore isExecuted is a valid boolean property in n8n runtime
} else if ($('Set Test Input').isExecuted) {
  token = $('Set Test Input').first().json.token || '';
  sessionId = $('Set Test Input').first().json.sessionId || '';
}
return { token, sessionId };`,
      },
      id: 'prepare-input',
      name: 'Prepare Input',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('tool-get-user-by-token-prepare'),
    },
    {
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: '',
            typeValidation: 'strict',
          },
          conditions: [
            {
              id: 'token-exists',
              leftValue: '={{ $json.token }}',
              rightValue: '',
              operator: {
                type: 'string',
                operation: 'notEmpty',
              },
            },
          ],
          combinator: 'and',
        },
        options: {},
      },
      id: 'check-token',
      name: 'Has Token?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: getNodeCoordinates('tool-get-user-by-token-check'),
    },
    {
      parameters: {
        method: 'POST',
        url: process.env.GRAPHQL_ENDPOINT,
        authentication: 'genericCredentialType',
        genericAuthType: 'none',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: 'Content-Type',
              value: 'application/json',
            },
            {
              name: 'Authorization',
              value: '={{ $json.token }}',
            },
          ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: JSON.stringify({ query: getUserDataQuery, variables: {} }),
        options: {},
      },
      id: 'http-request',
      name: 'Get User Data',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: getNodeCoordinates('tool-get-user-by-token-http'),
    },
    {
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'user',
              name: 'user',
              value: '={{ $json.data?.me || null }}',
              type: 'object',
            },
            {
              id: 'sessionId',
              name: 'sessionId',
              value: "={{ $('Prepare Input').first().json.sessionId || '' }}",
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-user',
      name: 'Set User',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('tool-get-user-by-token-set-user'),
    },
    {
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'user',
              name: 'user',
              value: '={{ null }}',
              type: 'object',
            },
            {
              id: 'sessionId',
              name: 'sessionId',
              value: "={{ $('Prepare Input').first().json.sessionId || '' }}",
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-no-user',
      name: 'Set No User',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('tool-get-user-by-token-set-no-user'),
    },
    {
      id: 'merge-results',
      name: 'Merge Results',
      type: 'n8n-nodes-base.merge',
      typeVersion: 3,
      position: [1100, 300],
      parameters: {},
    },
    {
      parameters: {
        workflowId: { __rl: true, mode: 'name', value: 'Tool: Upsert User' },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            userId: '={{ $json.user?.id || "" }}',
            sessionId: '={{ $json.sessionId || "" }}',
            userName: '={{ $json.user?.fullname || "" }}',
          },
        },
      },
      id: 'call-upsert-user',
      name: 'Upsert User',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [1320, 300],
    },
    {
      id: 'combine-output',
      name: 'Combine Output',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [1540, 300],
      parameters: {
        jsCode: combineOutputCode,
      },
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
      main: [[{ node: 'Has Token?', type: 'main', index: 0 }]],
    },
    'Has Token?': {
      main: [
        [{ node: 'Get User Data', type: 'main', index: 0 }],
        [{ node: 'Set No User', type: 'main', index: 0 }],
      ],
    },
    'Get User Data': {
      main: [[{ node: 'Set User', type: 'main', index: 0 }]],
    },
    'Set User': {
      main: [[{ node: 'Merge Results', type: 'main', index: 0 }]],
    },
    'Set No User': {
      main: [[{ node: 'Merge Results', type: 'main', index: 1 }]],
    },
    'Merge Results': {
      main: [[{ node: 'Upsert User', type: 'main', index: 0 }]],
    },
    'Upsert User': {
      main: [[{ node: 'Combine Output', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
    saveDataErrorExecution:
      process.env.NODE_ENV === 'development' ? 'all' : 'none',
    saveDataSuccessExecution:
      process.env.NODE_ENV === 'development' ? 'all' : 'none',
    saveManualExecutions: false,
    saveExecutionProgress: true,
  },
  meta: {
    instanceId: 'narasim-dev-tool-get-user-by-token',
  },
}

export default [toolGetUserByToken]

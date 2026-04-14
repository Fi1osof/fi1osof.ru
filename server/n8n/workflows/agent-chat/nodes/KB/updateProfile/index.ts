import { WorkflowBase, WorkflowName } from 'server/n8n/workflows/interfaces'
import { createHandleResponseNode } from 'server/n8n/workflows/helpers'
import { getGraphqlRequestWorkflowName } from 'server/n8n/workflows/tool-graphql-request/helpers'
import { print } from 'graphql'
import { UpdateCurrentUserDocument } from 'src/gql/generated'
import { AgentFactoryConfig } from 'server/n8n/workflows/agent-factory/interfaces'

export function getUpdateProfileWorkflowName(agentName: string): WorkflowName {
  return `Tool: Update Profile (${agentName})`
}

const updateProfileMutation = print(UpdateCurrentUserDocument)

export function createToolUpdateProfile(
  config: AgentFactoryConfig,
): WorkflowBase | null {
  const { agentName, hasGraphqlTool } = config

  if (!hasGraphqlTool) {
    return null
  }

  const prepareGraphqlCode = `
const input = $input.first().json

const data = {}

const fields = ['fullname', 'intro', 'content']

for (const field of fields) {
  if (
    input[field] 
    && input[field] !== "null" 
    && input[field] !== "undefined"
  ) {
    data[field] = input[field]
  }
}

const variables = {
  data,
}

return {
  query: \`${updateProfileMutation}\`,
  variables: JSON.stringify(variables),
}
`

  return {
    name: getUpdateProfileWorkflowName(agentName),
    active: true,
    versionId: `tool-update-profile-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
    nodes: [
      {
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [-400, 300],
        parameters: {
          workflowInputs: {
            values: [
              { name: 'reasoning', type: 'string' },
              { name: 'fullname', type: 'string' },
              { name: 'intro', type: 'string' },
              { name: 'content', type: 'string' },
            ],
          },
        },
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
        id: 'set-test-input',
        name: 'Set Test Input',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [0, 500],
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'reasoning',
                name: 'reasoning',
                value: 'Test reasoning',
                type: 'string',
              },
              {
                id: 'fullname',
                name: 'fullname',
                value: 'Test Name',
                type: 'string',
              },
            ],
          },
          options: {},
        },
      },
      {
        parameters: { jsCode: prepareGraphqlCode },
        id: 'prepare-graphql',
        name: 'Prepare GraphQL',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [0, 300],
      },
      {
        parameters: {
          source: 'database',
          workflowId: {
            __rl: true,
            mode: 'name',
            value: getGraphqlRequestWorkflowName(agentName),
          },
          workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
              query: '={{ $json.query }}',
              variables: '={{ $json.variables }}',
            },
          },
        },
        id: 'call-graphql',
        name: 'Call GraphQL',
        type: 'n8n-nodes-base.executeWorkflow',
        typeVersion: 1.2,
        position: [400, 300],
      },
      createHandleResponseNode({
        nodeId: 'handle-response',
        position: [800, 300],
      }),
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Prepare GraphQL', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Prepare GraphQL', type: 'main', index: 0 }]],
      },
      'Prepare GraphQL': {
        main: [[{ node: 'Call GraphQL', type: 'main', index: 0 }]],
      },
      'Call GraphQL': {
        main: [[{ node: 'Handle Response', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: { executionOrder: 'v1' },
    meta: {
      instanceId: `narasim-dev-tool-update-profile-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

import { WorkflowBase, WorkflowName } from 'server/n8n/workflows/interfaces'
import { createHandleResponseNode } from 'server/n8n/workflows/helpers'
import { getGraphqlRequestWorkflowName } from 'server/n8n/workflows/tool-graphql-request/helpers'
import { print } from 'graphql'
import { UpdateConceptDocument } from 'src/gql/generated'

export function getUpdateConceptWorkflowName(agentName: string): WorkflowName {
  return `Tool: Update Concept (${agentName})`
}

export interface UpdateConceptConfig {
  agentName: string
}

const updateConceptMutation = print(UpdateConceptDocument)

export function createToolUpdateConcept(
  config: UpdateConceptConfig,
): WorkflowBase {
  const { agentName } = config

  const prepareGraphqlCode = `
const input = $input.first().json

const data = {}
if (input.type) data.type = input.type
if (input.name) data.name = input.name
if (input.description) data.description = input.description
if (input.content) data.content = input.content

const variables = {
  id: input.id,
  data,
  detailedInfo: input.detailedInfo !== false && input.detailedInfo !== 'false',
}

return {
  query: \`${updateConceptMutation}\`,
  variables: JSON.stringify(variables),
}
`

  return {
    name: getUpdateConceptWorkflowName(agentName),
    active: true,
    versionId: `tool-update-concept-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
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
              { name: 'id', type: 'string' },
              { name: 'type', type: 'string' },
              { name: 'name', type: 'string' },
              { name: 'description', type: 'string' },
              { name: 'content', type: 'string' },
              { name: 'detailedInfo', type: 'boolean' },
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
              { id: 'id', name: 'id', value: 'test-id', type: 'string' },
              {
                id: 'name',
                name: 'name',
                value: 'Updated Name',
                type: 'string',
              },
              {
                id: 'detailedInfo',
                name: 'detailedInfo',
                value: true,
                type: 'boolean',
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
      instanceId: `narasim-dev-tool-update-concept-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

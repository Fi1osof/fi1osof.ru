import { WorkflowBase, WorkflowName } from 'server/n8n/workflows/interfaces'
import { createHandleResponseNode } from 'server/n8n/workflows/helpers'
import { getGraphqlRequestWorkflowName } from 'server/n8n/workflows/tool-graphql-request/helpers'
import { print } from 'graphql'
import { CreateConceptDocument } from 'src/gql/generated'

export function getCreateConceptWorkflowName(agentName: string): WorkflowName {
  return `Tool: Create Concept (${agentName})`
}

export interface CreateConceptConfig {
  agentName: string
}

const createConceptMutation = print(CreateConceptDocument)

export function createToolCreateConcept(
  config: CreateConceptConfig,
): WorkflowBase {
  const { agentName } = config

  const prepareGraphqlCode = `
const input = $input.first().json

const variables = {
  data: {
    type: input.type,
    name: input.name,
    description: input.description,
    content: input.content,
  },
  detailedInfo: input.detailedInfo !== false && input.detailedInfo !== 'false',
}

return {
  query: \`${createConceptMutation}\`,
  variables: JSON.stringify(variables),
}
`

  return {
    name: getCreateConceptWorkflowName(agentName),
    active: true,
    versionId: `tool-save-knowledge-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'type',
                type: 'string',
              },
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'description',
                type: 'string',
              },
              {
                name: 'content',
                type: 'string',
              },
              {
                name: 'detailedInfo',
                type: 'boolean',
              },
            ],
          },
        },
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [-400, 300],
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
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'type',
                name: 'type',
                value: 'TEST_TYPE',
                type: 'string',
              },
              {
                id: 'name',
                name: 'name',
                value: 'Test Concept',
                type: 'string',
              },
              {
                id: 'description',
                name: 'description',
                value: 'Test description',
                type: 'string',
              },
              {
                id: 'content',
                name: 'content',
                value: 'Test content',
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
        id: 'set-test-input',
        name: 'Set Test Input',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [0, 500],
      },
      {
        parameters: {
          jsCode: prepareGraphqlCode,
        },
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
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: `narasim-dev-tool-save-knowledge-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

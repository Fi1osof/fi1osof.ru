import { WorkflowBase, WorkflowName } from 'server/n8n/workflows/interfaces'
import { createHandleResponseNode } from 'server/n8n/workflows/helpers'
import { getGraphqlRequestWorkflowName } from 'server/n8n/workflows/tool-graphql-request/helpers'
import { print } from 'graphql'
import { MyConceptsDocument } from 'src/gql/generated'
import { AgentFactoryConfig } from 'server/n8n/workflows/agent-factory/interfaces'

export function getReadConceptsWorkflowName(agentName: string): WorkflowName {
  return `Tool: Read Concepts (${agentName})`
}

const readConceptsQuery = print(MyConceptsDocument)

export function createToolReadConcepts(
  config: AgentFactoryConfig,
): WorkflowBase | null {
  const { agentName, hasGraphqlTool } = config

  if (!hasGraphqlTool) {
    return null
  }

  const prepareGraphqlCode = `
const input = $input.first().json

const variables = {
  detailedInfo: input.detailedInfo === true || input.detailedInfo === 'true',
}

if (input.ids) {
  const idsArray = typeof input.ids === 'string' ? input.ids.split(',').map(id => id.trim()) : input.ids

  variables.where = {
    ids:  idsArray.length ? idsArray : undefined,
  }
}

return {
  query: \`${readConceptsQuery}\`,
  variables: JSON.stringify(variables),
}
`

  return {
    name: getReadConceptsWorkflowName(agentName),
    active: true,
    versionId: `tool-read-concepts-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
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
              {
                name: 'reasoning',
                type: 'string',
              },
              {
                name: 'detailedInfo',
                type: 'boolean',
              },
              {
                name: 'ids',
                type: 'string',
              },
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
                id: 'detailedInfo',
                name: 'detailedInfo',
                value: false,
                type: 'boolean',
              },
              {
                id: 'ids',
                name: 'ids',
                value: '',
                type: 'string',
              },
            ],
          },
          options: {},
        },
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
      instanceId: `narasim-dev-tool-read-concepts-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

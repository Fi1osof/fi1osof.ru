import fs from 'fs'
import { print } from 'graphql'
import path from 'path'
import {
  AgentFactoryConfig,
  ConnectionsType,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { createAgentNode } from 'server/n8n/workflows/agent-factory/nodes/createAgentNode'
import { createStaticInputs } from 'server/n8n/workflows/helpers'
import { getAgentWorldToolWorkflowName } from 'server/n8n/workflows/tool-agent-world/helpers'
import { getGraphqlRequestWorkflowName } from 'server/n8n/workflows/tool-graphql-request/helpers'
import {
  MindLogType,
  MyMindLogsDocument,
  MyMindLogsQueryVariables,
} from 'src/gql/generated'

const prepareAgentInputCode = fs.readFileSync(
  path.join(__dirname, 'prepareInput.js'),
  'utf-8',
)

const searchMindLogsQuery = print(MyMindLogsDocument)

type getDecompositorProps = {
  config: AgentFactoryConfig
  mainAgentNode: NodeType
}

const DECOMPOSITOR_SYSTEM_MESSAGE = `# Analyze the incoming message and output only the core essence in a structured way.
Do not give recommendations on what or how to respond, just compress the message essence very concisely.
`

export function getDecompositor({
  config,
  mainAgentNode,
}: getDecompositorProps) {
  const { agentId, agentName, modelDecompositor } = config

  const decompositorAgentId = agentId + '-decompositor'
  const decompositorAgentName = agentName + '-decompositor'

  const position: [number, number] = [
    mainAgentNode.position[0] - 1000,
    mainAgentNode.position[1] - 300,
  ]

  const prepareAgentInputNode: NodeType = {
    id: `${decompositorAgentId}-prepare-agent-input`,
    name: `Prepare Agent Input (${decompositorAgentId})`,
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [position[0] - 150, position[1]],
    parameters: {
      jsCode: prepareAgentInputCode,
    },
  }

  const decompositorAgentNode = createAgentNode({
    agentId: decompositorAgentId,
    agentName: decompositorAgentName,
    agentNodeType: 'orchestrator',
    enableStreaming: false,
    maxIterations: parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
    model: modelDecompositor,
    systemMessage: DECOMPOSITOR_SYSTEM_MESSAGE,
    hasTools: false,
    position,
  })

  const prepareToolsNode: NodeType = {
    id: `${agentName}-prepare-tools`,
    name: 'Prepare Tools',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [
      decompositorAgentNode.position[0] - 700,
      decompositorAgentNode.position[1] - 420,
    ],
    parameters: {
      jsCode: 'return $input.all()',
    },
  }

  const agentWorldToolNode: NodeType = {
    id: `${agentName}tool-agent-world`,
    name: 'Tool: Agent World',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.2,
    position: [
      prepareToolsNode.position[0] + 300,
      prepareToolsNode.position[1] - 375,
    ],
    parameters: {
      source: 'database',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getAgentWorldToolWorkflowName(),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          operation: 'read',
          maxDepth: '3',
        },
      },
    },
  }

  const variables: MyMindLogsQueryVariables = {
    where: {
      type: {
        in: [MindLogType.CONTEXT, MindLogType.KNOWLEDGE],
      },
    },
  }

  const decompositorAgentGraphqlNode: NodeType = {
    id: `${agentName}tool-graphql`,
    name: 'GraphQL Request (Chat Agent)',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.2,
    position: [
      agentWorldToolNode.position[0],
      agentWorldToolNode.position[1] + 150,
    ],
    parameters: {
      source: 'database',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getGraphqlRequestWorkflowName(config.agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: createStaticInputs([
          {
            name: 'query',
            value: searchMindLogsQuery,
            type: 'string',
            required: true,
          },
          {
            name: 'variables',
            value: `${JSON.stringify(variables)}`,
            type: 'string',
            required: true,
          },
        ]).value,
      },
    },
  }

  const mergeToolsNode: NodeType = {
    id: `${agentName}-merge-tools`,
    name: 'Merge Tools',
    type: 'n8n-nodes-base.merge',
    typeVersion: 3,
    position: [
      agentWorldToolNode.position[0] + 300,
      prepareToolsNode.position[1],
    ],
    parameters: {
      numberInputs: 4,
    },
  }

  const connections: ConnectionsType = {
    [`Prepare Agent Input (${decompositorAgentId})`]: {
      main: [[{ node: decompositorAgentName, type: 'main', index: 0 }]],
    },
    [prepareToolsNode.name]: {
      main: [
        [
          { node: agentWorldToolNode.name, type: 'main', index: 0 },
          { node: decompositorAgentGraphqlNode.name, type: 'main', index: 0 },
          { node: mergeToolsNode.name, type: 'main', index: 0 },
        ],
      ],
    },
    [agentWorldToolNode.name]: {
      main: [[{ node: mergeToolsNode.name, type: 'main', index: 1 }]],
    },
    [decompositorAgentGraphqlNode.name]: {
      main: [[{ node: mergeToolsNode.name, type: 'main', index: 2 }]],
    },
    [mergeToolsNode.name]: {
      main: [[{ node: prepareAgentInputNode.name, type: 'main', index: 0 }]],
    },
  }

  return {
    decompositorAgentNodes: [
      prepareToolsNode,
      agentWorldToolNode,
      decompositorAgentGraphqlNode,
      mergeToolsNode,
      prepareAgentInputNode,
      decompositorAgentNode,
    ],
    decompositorAgentConnections: connections,
    mergeToolsNode,
    decompositorAgentNode,
  }
}

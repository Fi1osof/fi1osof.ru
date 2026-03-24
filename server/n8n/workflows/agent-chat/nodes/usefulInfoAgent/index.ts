import fs from 'fs'
import path from 'path'
import {
  AgentFactoryConfig,
  ConnectionsType,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { createAgentNode } from 'server/n8n/workflows/agent-factory/nodes/createAgentNode'

const prepareAgentInputCode = fs.readFileSync(
  path.join(__dirname, 'prepareInput.js'),
  'utf-8',
)

type GetUsefulInfoAgentProps = {
  config: AgentFactoryConfig
  mainAgentNode: NodeType
  mergeToolsNode: NodeType
}

const USEFUL_INFO_SYSTEM_MESSAGE = `Analyze the incoming message and available data.

Task:
- Identify relevant information for processing the message, if any exists and is needed
- Form a brief summary if some information is likely to be useful.

Response format:
Only facts from the provided data, grouped by sources.
If nothing is directly relevant, do not include it.

`

export function getUsefulInfoAgent({
  config,
  mainAgentNode,
  mergeToolsNode: _mergeToolsNode,
}: GetUsefulInfoAgentProps) {
  const { agentId, agentName, model } = config

  const usefulInfoAgentId = agentId + '-useful-info'
  const usefulInfoAgentName = agentName + '-useful-info'

  const position: [number, number] = [
    mainAgentNode.position[0] - 500,
    mainAgentNode.position[1] + 200,
  ]

  const prepareAgentInputNode: NodeType = {
    id: `${usefulInfoAgentId}-prepare-agent-input`,
    name: `Prepare Agent Input (${usefulInfoAgentId})`,
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [position[0] - 300, position[1]],
    parameters: {
      jsCode: prepareAgentInputCode,
    },
  }

  const ifHasDataNode: NodeType = {
    id: `${usefulInfoAgentId}-if-has-data`,
    name: `If Has Data (${usefulInfoAgentId})`,
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [position[0] - 150, position[1]],
    parameters: {
      conditions: {
        options: {
          version: 2,
          caseSensitive: true,
          typeValidation: 'strict',
        },
        combinator: 'and',
        conditions: [
          {
            id: 'chatInputExists',
            leftValue: '={{ $json.chatInput }}',
            rightValue: '',
            operator: {
              type: 'string',
              operation: 'notEmpty',
            },
          },
        ],
      },
    },
  }

  const usefulInfoAgentNode = createAgentNode({
    agentId: usefulInfoAgentId,
    agentName: usefulInfoAgentName,
    agentNodeType: 'orchestrator',
    enableStreaming: true,
    maxIterations: parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
    model,
    systemMessage: USEFUL_INFO_SYSTEM_MESSAGE,
    hasTools: false,
    position,
  })

  const connections: ConnectionsType = {
    [prepareAgentInputNode.name]: {
      main: [[{ node: ifHasDataNode.name, type: 'main', index: 0 }]],
    },
    [ifHasDataNode.name]: {
      main: [
        [{ node: usefulInfoAgentName, type: 'main', index: 0 }], // true - has data
        [], // false - no data, skip agent
      ],
    },
  }

  return {
    usefulInfoAgentNodes: [
      prepareAgentInputNode,
      ifHasDataNode,
      usefulInfoAgentNode,
    ],
    usefulInfoAgentConnections: connections,
    prepareAgentInputNode,
    usefulInfoAgentNode,
  }
}

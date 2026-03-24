import * as path from 'path'
import fs from 'fs'
import {
  AgentFactoryConfig,
  ConnectionsType,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { createAgentNode } from 'server/n8n/workflows/agent-factory/nodes/createAgentNode'

type GetMainAgentProps = {
  config: AgentFactoryConfig
}

export function getMainAgent({
  config,
}: GetMainAgentProps): [NodeType[], ConnectionsType, agentNode: NodeType] {
  const {
    agentId,
    agentName,
    agentNodeType = 'orchestrator',
    enableStreaming = true,
    maxIterations = parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
    model,
    // systemMessagePath,
  } = config

  const prepareAgentInputCode = fs.readFileSync(
    path.join(__dirname, './prepareAgentInput.js'),
    'utf-8',
  )

  const baseSystemMessage = fs.readFileSync(
    path.join(__dirname, './system-message.md'),
    'utf-8',
  )

  const systemMessage = `${baseSystemMessage}
  `

  const position: [number, number] = [112, 304]

  const agentNode = createAgentNode({
    agentId,
    agentName,
    agentNodeType,
    enableStreaming,
    maxIterations,
    model,
    systemMessage,
    hasTools: true,
    position,
  })

  const prepareAgentInputNode: NodeType = {
    parameters: {
      jsCode: prepareAgentInputCode,
    },
    id: `${agentId}-prepare-agent-input`,
    name: `Prepare Agent Input (${agentId})`,
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [position[0] - 150, position[1]],
  }

  const nodes: NodeType[] = [prepareAgentInputNode, agentNode]

  const connections: ConnectionsType = {
    [`Prepare Agent Input (${agentId})`]: {
      main: [[{ node: agentName, type: 'main', index: 0 }]],
    },
  }

  return [nodes, connections, agentNode]
}

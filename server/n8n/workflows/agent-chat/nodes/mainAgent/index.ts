import * as path from 'path'
import fs from 'fs'
import {
  AgentFactoryConfig,
  ConnectionsType,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { createAgentNode } from 'server/n8n/workflows/agent-factory/nodes/createAgentNode'
import {
  getCodeExecutionNodes,
  getCodeExecutionConnections,
} from 'server/n8n/workflows/agent-factory/tools/codeExecution'
import {
  getMemoryRecallNodes,
  getMemoryRecallConnections,
} from 'server/n8n/workflows/agent-factory/tools/memoryRecall'

type GetMainAgentProps = {
  config: AgentFactoryConfig
  hasMemory: boolean
}

export function getMainAgent({
  config,
  hasMemory,
}: GetMainAgentProps): [NodeType[], ConnectionsType, agentNode: NodeType] {
  const {
    agentId,
    agentName,
    agentNodeType = 'orchestrator',
    enableStreaming = true,
    maxIterations = parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
    model,
    canAccessFileSystem = false,
    hasMemoryRecall = false,
  } = config

  const prepareAgentInputCode = fs.readFileSync(
    path.join(__dirname, './prepareAgentInput.js'),
    'utf-8',
  )

  const baseSystemMessage = fs.readFileSync(
    path.join(__dirname, './system-message.md'),
    'utf-8',
  )

  const systemMessage = `${baseSystemMessage}`

  const position: [number, number] = [2080, -128]

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
    position: [position[0] - 144, position[1]],
  }

  // Tool nodes based on config flags
  const codeExecutionNodes: NodeType[] = canAccessFileSystem
    ? getCodeExecutionNodes({ agentId, agentName })
    : []

  const codeExecutionConnections: ConnectionsType = canAccessFileSystem
    ? getCodeExecutionConnections({ agentId, agentName })
    : {}

  const memoryRecallNodes: NodeType[] = hasMemoryRecall
    ? getMemoryRecallNodes({ agentId, agentName })
    : []

  const memoryRecallConnections: ConnectionsType = hasMemoryRecall
    ? getMemoryRecallConnections({ agentId, agentName })
    : {}

  const nodes: NodeType[] = [
    prepareAgentInputNode,
    agentNode,
    ...codeExecutionNodes,
    ...memoryRecallNodes,
  ]

  const connections: ConnectionsType = {
    [`Prepare Agent Input (${agentId})`]: {
      main: [[{ node: agentName, type: 'main', index: 0 }]],
    },
    ...codeExecutionConnections,
    ...memoryRecallConnections,
    ...(hasMemory && {
      ['Simple Memory']: {
        ai_memory: [[{ node: agentName, type: 'ai_memory', index: 0 }]],
      },
    }),
  }

  return [nodes, connections, agentNode]
}

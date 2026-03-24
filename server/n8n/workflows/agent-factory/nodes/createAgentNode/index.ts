import { NodeType } from '../../interfaces'

type CreateAgentNodeProps = {
  agentId: string
  agentName: string
  agentNodeType?: 'orchestrator' | 'default'
  enableStreaming?: boolean
  maxIterations?: number
  model?: string
  systemMessage: string
  hasTools?: boolean
  position: [number, number]
}

export function createAgentNode({
  agentId,
  agentName,
  agentNodeType = 'orchestrator',
  enableStreaming = true,
  maxIterations = parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
  model,
  systemMessage,
  hasTools = true,
  position,
}: CreateAgentNodeProps): NodeType {
  const agentNode: NodeType = {
    parameters: {
      options: {
        systemMessage,
        maxIterations,
        enableStreaming: `={{ $json.enableStreaming === false || $json.enableStreaming === "false" ? false : ${enableStreaming} }}`,
      },
    },
    id: agentId,
    name: agentName,
    type: '@n8n/n8n-nodes-langchain.agent',
    typeVersion: 3.1,
    position,
  }

  if (agentNodeType === 'orchestrator') {
    agentNode.parameters.mode = 'full'
    agentNode.parameters.model = model

    const additionalFields = {
      systemMessage: `=${systemMessage}`,
      assistantMessages: '={{ $json.assistantMessages }}',
      enableStreaming: '={{ $json.enableStreaming }}',
      streamTechnicalInfo: process.env.STREAM_TECHNICAL_INFO !== 'false',
      toolChoice: 'auto',
      hasTools,
    }

    agentNode.parameters.options = Object.assign(
      agentNode.parameters.options ?? {},
      additionalFields,
    )

    agentNode.type = 'CUSTOM.agentOrchestrator'
    agentNode.typeVersion = 1
    agentNode.credentials = {
      openRouterApi: {
        id: 'FsN0N48lU327xkz6',
        name: 'OpenRouter',
      },
    }
  }

  return agentNode
}

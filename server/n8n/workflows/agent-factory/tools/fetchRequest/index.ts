import { createTool, createToolInputs } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

interface FetchRequestToolsConfig {
  agentId: string
  agentName: string
}

export function getFetchRequestNodes(
  config: FetchRequestToolsConfig,
): NodeType[] {
  const { agentId } = config

  return [
    createTool({
      name: 'fetch_request',
      toolName: 'Fetch Request Tool',
      description:
        'Execute HTTP request using fetch. Returns status, statusText and body.',
      workflowName: 'Tool: Fetch Request',
      nodeId: `${agentId}-tool-fetch`,
      position: getNodeCoordinates('tool-fetch'),
      inputs: createToolInputs([
        {
          name: 'url',
          description:
            'Full URL starting with http:// or https://, e.g. https://api.example.com/data',
          type: 'string',
          required: true,
        },
        {
          name: 'method',
          description:
            'HTTP method: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
          type: 'string',
          required: true,
        },
        {
          name: 'headers',
          description:
            'Request headers as object. Could be empty, e.g. {"Content-Type": "application/json", "Authorization": "Bearer token"}',
          type: 'string',
        },
        {
          name: 'body',
          description:
            'Request body as object for POST/PUT/PATCH requests. Could be empty',
          type: 'string',
        },
      ]),
    }),
  ]
}

export function getFetchRequestConnections(
  config: FetchRequestToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Fetch Request Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}

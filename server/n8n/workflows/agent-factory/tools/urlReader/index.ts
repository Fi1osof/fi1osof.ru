import { createTool, createToolInputs } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

interface UrlReaderToolsConfig {
  agentId: string
  agentName: string
}

export function getUrlReaderNodes(config: UrlReaderToolsConfig): NodeType[] {
  const { agentId } = config

  return [
    createTool({
      name: 'read_url_content',
      toolName: 'Read URL Content Tool',
      description:
        'Read and parse content from external URL. Returns markdown-formatted content extracted from the webpage. Use this to read articles, documentation, or any web page content.',
      workflowName: 'Tool: Parsing HTML',
      nodeId: `${agentId}-tool-url-reader`,
      position: getNodeCoordinates('tool-url-reader'),
      inputs: createToolInputs([
        {
          name: 'url',
          description:
            'Full URL starting with http:// or https://, e.g. https://example.com/article',
          type: 'string',
          required: true,
        },
      ]),
    }),
  ]
}

export function getUrlReaderConnections(
  config: UrlReaderToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Read URL Content Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}

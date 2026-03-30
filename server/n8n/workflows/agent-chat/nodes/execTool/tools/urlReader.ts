import { NodeType } from 'server/n8n/workflows/agent-factory/interfaces'
import { getExecToolWorkflowName } from 'server/n8n/workflows/tool-exec-tool/factory'
import { GetExecToolConfig, reasoningTitle } from '../interfaces'

export function getUrlReaderTool(
  config: GetExecToolConfig,
): NodeType | undefined {
  const { agentId, agentName, canReadUrls } = config

  if (!canReadUrls) {
    return undefined
  }

  return {
    id: `${agentId}-tool-url-reader`,
    name: 'Read URL Content Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2880, 2328],
    parameters: {
      name: 'read_url_content',
      description:
        'Read and parse content from external URL. Returns markdown-formatted content extracted from the webpage. Use this to read articles, documentation, or any web page content.',
      workflowId: {
        __rl: true,
        mode: 'name',
        value: getExecToolWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          targetWorkflow: 'Tool: Parsing HTML',
          reasoning: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('reasoning', '${reasoningTitle}', 'string') }}`,
          url: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('url', 'Full URL starting with http:// or https://', 'string') }}`,
        },
        matchingColumns: [],
        schema: [
          {
            id: 'targetWorkflow',
            displayName: 'targetWorkflow',
            required: true,
            defaultMatch: false,
            display: false,
            type: 'string',
            canBeUsedToMatch: false,
          },
          {
            id: 'reasoning',
            displayName: 'reasoning',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
          {
            id: 'url',
            displayName: 'url',
            required: true,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
  }
}

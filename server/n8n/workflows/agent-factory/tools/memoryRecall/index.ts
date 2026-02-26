import {
  createTool,
  createToolInputs,
  createStaticInputs,
} from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

interface MemoryRecallToolConfig {
  agentId: string
  agentName: string
}

export function getMemoryRecallNodes(
  config: MemoryRecallToolConfig,
): NodeType[] {
  const { agentId } = config

  const toolInputs = createToolInputs([
    {
      name: 'chatInput',
      description: 'What information to search for in tool calls history',
      type: 'string',
      required: true,
    },
  ])

  const staticInputs = createStaticInputs([
    {
      name: 'sessionId',
      value: "={{ $('Prepare Context').first().json.sessionId }}",
      type: 'string',
      required: true,
    },
    {
      name: 'workflowId',
      value: '={{ $workflow.id }}',
      type: 'string',
      required: true,
    },
    {
      name: 'skipMemoryRecording',
      value: true,
      type: 'boolean',
      required: true,
    },
  ])

  return [
    createTool({
      name: 'memory_recall',
      toolName: 'Memory Recall Tool',
      description:
        'AI-powered semantic search through your tool call history in this session. Ask natural language questions to recall previous tool calls, their parameters, returned results, or any information retrieved in earlier steps.',
      workflowName: 'Memory Recall',
      nodeId: `${agentId}-tool-memory-recall`,
      position: getNodeCoordinates('tool-memory-recall'),
      inputs: {
        value: {
          ...toolInputs.value,
          ...staticInputs.value,
        },
        schema: [...toolInputs.schema, ...staticInputs.schema],
      },
    }),
  ]
}

export function getMemoryRecallConnections(
  config: MemoryRecallToolConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Memory Recall Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}

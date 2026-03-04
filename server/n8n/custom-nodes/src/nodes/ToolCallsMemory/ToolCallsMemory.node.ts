import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow'
import { ToolCallRecord, toolCallsMemory } from './helpers/toolCallsMemory'

export class ToolCallsMemory implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Tool Calls Memory',
    name: 'toolCallsMemory',
    icon: 'fa:history',
    iconColor: 'black',
    group: ['transform'],
    version: 1,
    description: 'Add or query tool calls history stored in process memory',
    defaults: {
      name: 'Tool Calls Memory',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Add',
            value: 'add',
            description: 'Add a tool call record to memory',
          },
          {
            name: 'Query',
            value: 'query',
            description: 'Get tool call records with optional filters',
          },
          {
            name: 'Stats',
            value: 'stats',
            description: 'Get statistics about stored records',
          },
        ],
        default: 'query',
      },
      {
        displayName: 'Workflow ID',
        name: 'workflowId',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Agent ID',
        name: 'agentId',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Agent Name',
        name: 'agentName',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Tool Name',
        name: 'toolName',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Tool Arguments',
        name: 'toolArguments',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Tool Result',
        name: 'toolResult',
        type: 'string',
        default: '',
        typeOptions: { rows: 4 },
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['add'] },
        },
      },
      {
        displayName: 'Filter: Workflow ID',
        name: 'filterWorkflowId',
        type: 'string',
        default: '',
        description: 'Filter records by workflow ID (primary isolation key)',
        displayOptions: {
          show: { operation: ['query'] },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: undefined,
        displayOptions: {
          show: { operation: ['query'] },
        },
      },
      {
        displayName: 'Current Session ID',
        name: 'currentSessionId',
        type: 'string',
        default: '',
        description:
          'Current session ID passed as context to the agent — not used as a filter, but included in output so the agent can make its own decisions about relevance',
        displayOptions: {
          show: { operation: ['query'] },
        },
      },
      {
        displayName: 'Current User ID',
        name: 'currentUserId',
        type: 'string',
        default: '',
        description:
          'Current user ID passed as context to the agent — not used as a filter, agent decides how to use this information',
        displayOptions: {
          show: { operation: ['query'] },
        },
      },
      {
        displayName: 'Format as System Message',
        name: 'formatAsSystemMessage',
        type: 'boolean',
        default: false,
        description:
          'If true, output includes a formatted string suitable for an LLM system message',
        displayOptions: {
          show: { operation: ['query'] },
        },
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const operation = this.getNodeParameter('operation', 0) as string

    if (operation === 'add') {
      const workflowId = this.getNodeParameter('workflowId', 0, '') as string
      const agentId = this.getNodeParameter('agentId', 0, '') as string
      const agentName = this.getNodeParameter('agentName', 0, '') as string
      const sessionId = this.getNodeParameter('sessionId', 0, '') as string
      const toolName = this.getNodeParameter('toolName', 0, '') as string
      const toolArgumentsRaw = this.getNodeParameter(
        'toolArguments',
        0,
        '{}',
      ) as string
      const toolResult = this.getNodeParameter('toolResult', 0, '') as string
      const userId = this.getNodeParameter('userId', 0, '') as string

      let toolArguments: Record<string, unknown> = {}
      try {
        toolArguments =
          typeof toolArgumentsRaw === 'string'
            ? JSON.parse(toolArgumentsRaw)
            : toolArgumentsRaw
      } catch {
        toolArguments = {}
      }

      const record: ToolCallRecord = {
        timestamp: new Date().toISOString(),
        workflowId,
        agentId,
        agentName,
        sessionId,
        toolName,
        toolArguments,
        toolResult,
        ...(userId ? { userId } : {}),
      }

      toolCallsMemory.addToolCall(record)
      const stats = toolCallsMemory.getStats()

      return [
        items.map((item) => ({
          json: { ...item.json, added: true, record, stats } as IDataObject,
        })),
      ]
    }

    if (operation === 'query') {
      const filterWorkflowId = this.getNodeParameter(
        'filterWorkflowId',
        0,
        '',
      ) as string
      const limit = this.getNodeParameter('limit', 0, 20) as number
      const currentSessionId = this.getNodeParameter(
        'currentSessionId',
        0,
        '',
      ) as string
      const currentUserId = this.getNodeParameter(
        'currentUserId',
        0,
        '',
      ) as string
      const formatAsSystemMessage = this.getNodeParameter(
        'formatAsSystemMessage',
        0,
        false,
      ) as boolean

      const records = toolCallsMemory.getToolCalls({
        workflowId: filterWorkflowId,
        limit,
      })

      const result: Record<string, unknown> = {
        records,
        recordCount: records.length,
        currentSessionId: currentSessionId || null,
        currentUserId: currentUserId || null,
      }

      if (formatAsSystemMessage) {
        result.formattedHistory =
          toolCallsMemory.formatForSystemMessage(records)
      }

      return [
        items.map((item) => ({
          json: { ...item.json, ...result } as IDataObject,
        })),
      ]
    }

    if (operation === 'stats') {
      const stats = toolCallsMemory.getStats()
      return [
        items.map((item) => ({
          json: { ...item.json, ...stats } as IDataObject,
        })),
      ]
    }

    return [items]
  }
}

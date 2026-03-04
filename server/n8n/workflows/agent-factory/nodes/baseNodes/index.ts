import * as fs from 'fs'
import * as path from 'path'
import { AgentFactoryConfig, NodeType } from '../../interfaces'
import type { INodeParameters } from 'n8n-workflow'
import { getFetchMindLogsNode } from './fetchMindLogsNode'
import { getAgentDataNode } from './getAgentDataNode'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'
import { getReflectionWorkflowName } from '../../../reflection/helpers'

type getBaseNodesProps = {
  agentId: string
  agentName: string
  hasMemory: boolean
  hasTools: boolean
  systemMessagePath: string
  memorySize: AgentFactoryConfig['memorySize']
  hasWorkflowOutput: AgentFactoryConfig['hasWorkflowOutput']
  maxIterations: AgentFactoryConfig['maxIterations']
  enableStreaming: AgentFactoryConfig['enableStreaming']
  agentNodeType: AgentFactoryConfig['agentNodeType']
  model: AgentFactoryConfig['model']
  workflowInputs: AgentFactoryConfig['workflowInputs']
  agentDescription: AgentFactoryConfig['agentDescription']
  webhookId: AgentFactoryConfig['webhookId']
  hasToolsParam?: boolean
}

export function getBaseNodes({
  agentId,
  agentName,
  hasMemory,
  hasTools,
  systemMessagePath,
  memorySize,
  hasWorkflowOutput,
  maxIterations,
  enableStreaming,
  agentNodeType,
  model,
  agentDescription,
  webhookId,
  workflowInputs = [],
  hasToolsParam,
}: getBaseNodesProps) {
  const prepareContextTemplate = fs.readFileSync(
    path.join(__dirname, 'prepareContext.js'),
    'utf-8',
  )

  const prepareAgentInputCode = fs.readFileSync(
    path.join(__dirname, 'prepareAgentInput.js'),
    'utf-8',
  )

  const baseSystemMessage = fs.readFileSync(
    path.join(__dirname, 'base-system-message.md'),
    'utf-8',
  )

  const customSystemMessage = fs.readFileSync(systemMessagePath, 'utf-8')

  const systemMessage = `${baseSystemMessage}

# Agent-Specific Instructions

${customSystemMessage}`

  const prepareContextCode = prepareContextTemplate.replace(
    '$config',
    JSON.stringify({ agentId }, null, 2),
  )

  const agentDataNode = getAgentDataNode({
    nodeId: `${agentId}-get-agent-data`,
    agentName,
    position: getNodeCoordinates('get-agent-data'),
  })

  const baseNodes: NodeType[] = [
    {
      parameters: {
        workflowInputs: {
          values: workflowInputs.map((input) => ({
            name: input.name,
            type: input.type || 'string',
            ...(input.default !== undefined && { default: input.default }),
          })),
        },
      },
      id: `${agentId}-workflow-trigger`,
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: getNodeCoordinates('workflow-trigger'),
    },
    {
      id: `${agentId}-webhook-trigger`,
      name: 'Webhook Trigger',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: getNodeCoordinates('webhook-trigger'),
      webhookId: `${agentId}-message`,
      parameters: {
        httpMethod: 'POST',
        path: `${agentId}-webhook`,
        responseMode: 'responseNode',
        options: {
          rawBody: false,
        },
      },
    },
    {
      id: `${agentId}-webhook-prepare-input`,
      name: 'Webhook Prepare Input',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('webhook-prepare-input'),
      parameters: {
        jsCode: `const body = $input.first().json.body || {}
return [{
  json: {
    chatInput: body.chatInput || '',
    sessionId: body.sessionId || '',
    token: body.token || ''
  }
}]`,
      },
    },
    {
      id: `${agentId}-chat-trigger`,
      name: 'When chat message received',
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: getNodeCoordinates('chat-trigger'),
      webhookId,
      parameters: {
        // public: true enables external webhook access (without it returns 404)
        public: true,
        // mode: 'webhook' for embedded chat / direct webhook calls (vs 'hostedChat' for n8n-served page)
        mode: 'webhook',
        availableInChat: true,
        agentName,
        agentDescription,
        options: {
          allowFileUploads: true,
        },
      },
    },
    {
      parameters: {
        jsCode: 'return $input.all()',
      },
      id: `${agentId}-merge-trigger`,
      name: 'Merge Trigger',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('merge-trigger'),
    },
    agentDataNode,
    {
      parameters: {
        jsCode: prepareContextCode,
      },
      id: `${agentId}-prepare-context`,
      name: 'Prepare Context',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('prepare-context'),
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: getReflectionWorkflowName(agentName),
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            agentId,
            chatInput: '={{ $json.chatInput }}',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'agentId',
              displayName: 'agentId',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'chatInput',
              displayName: 'chatInput',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: `${agentId}-reflection`,
      name: 'Reflection',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: getNodeCoordinates('reflection'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.merge',
      typeVersion: 3.2,
      position: getNodeCoordinates('merge-context'),
      id: `${agentId}-merge-context`,
      name: 'Merge Context',
    },
    ...(hasTools
      ? [
          getFetchMindLogsNode({ agentId, agentName }),
          {
            parameters: {},
            type: 'n8n-nodes-base.merge',
            typeVersion: 3.2,
            position: getNodeCoordinates('merge'),
            id: `${agentId}-merge`,
            name: 'Merge',
          },
          {
            parameters: {
              jsCode: prepareAgentInputCode,
            },
            id: `${agentId}-prepare-agent-input`,
            name: 'Prepare Agent Input',
            type: 'n8n-nodes-base.code',
            typeVersion: 2,
            position: getNodeCoordinates('prepare-agent-input'),
          },
        ]
      : []),
    (() => {
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
        position: getNodeCoordinates('agent'),
      }

      if (agentNodeType === 'orchestrator') {
        agentNode.parameters.mode = 'full'
        agentNode.parameters.model = model

        const additionalFields: INodeParameters = {
          systemMessage: `=${systemMessage}`,
          assistantMessages: '={{ $json.assistantMessages }}',
          enableStreaming: '={{ $json.enableStreaming }}',
          showToolCalls: true,
          toolChoice: 'auto',
          hasTools: hasToolsParam ?? hasTools,
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
    })(),
    ...(agentNodeType !== 'orchestrator'
      ? [
          {
            parameters: {
              model,
              options: {},
            },
            id: `${agentId}-chat-model`,
            name: 'Chat Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
            typeVersion: 1,
            position: [256, 520] as [number, number],
            credentials: {
              openRouterApi: {
                id: 'FsN0N48lU327xkz6',
                name: 'OpenRouter',
              },
            },
          },
        ]
      : []),
  ]

  if (hasMemory) {
    baseNodes.push({
      parameters: {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.sessionId }}',
        contextWindowLength: memorySize,
      },
      id: `${agentId}-memory`,
      name: 'Simple Memory',
      type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
      typeVersion: 1.3,
      position: getNodeCoordinates('memory'),
    })
  }

  if (hasWorkflowOutput) {
    baseNodes.push({
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'output',
              name: 'output',
              value: '={{ $json.output }}',
              type: 'string',
            },
            {
              id: 'usage',
              name: 'usage',
              value: '={{ $json.usage }}',
              type: 'object',
            },
          ],
        },
        options: {},
      },
      id: `${agentId}-workflow-output`,
      name: 'Workflow Output',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('workflow-output'),
    })

    baseNodes.push({
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: '',
            typeValidation: 'strict',
          },
          conditions: [
            {
              id: 'check-streaming',
              leftValue:
                "={{ $('Prepare Context').first().json.enableStreaming }}",
              rightValue: false,
              operator: {
                type: 'boolean',
                operation: 'equals',
              },
            },
          ],
          combinator: 'and',
        },
        options: {},
      },
      id: `${agentId}-if-not-streaming`,
      name: 'If Not Streaming',
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: getNodeCoordinates('if-not-streaming'),
    })

    baseNodes.push({
      parameters: {
        respondWith: 'allIncomingItems',
        options: {},
      },
      id: `${agentId}-respond-webhook`,
      name: 'Respond to Webhook',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: getNodeCoordinates('respond-webhook'),
    })
  }

  return { nodes: baseNodes, agentDataNode }
}

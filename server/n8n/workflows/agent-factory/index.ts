import * as fs from 'fs'
import * as path from 'path'
import { createToolGraphqlRequest } from '../tool-graphql-request/factory'
import { createReflectionWorkflow } from '../reflection/factory'
import {
  AgentFactoryConfig,
  AgentFactoryResult,
  ConnectionsType,
  NodeType,
} from './interfaces'
import { getKBNodes } from './nodes/kbNodes'
import { getEXNodes } from './nodes/exNodes'
import { getMindLogNodes } from './nodes/mindLogNodes'
import { getTaskNodes } from './nodes/taskNodes'
import { getTaskWorkLogNodes } from './nodes/taskWorkLogNodes'
import { WorkflowBase } from '../interfaces'
import { createAgentNode } from './nodes/createAgentNode'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'
import {
  getCodeExecutionNodes,
  getCodeExecutionConnections,
} from './tools/codeExecution'
import {
  getFetchRequestNodes,
  getFetchRequestConnections,
} from './tools/fetchRequest'
import { getGraphqlToolNodes } from './tools/graphql'
import {
  getWebSearchAgentNodes,
  getWebSearchAgentConnections,
} from './tools/webSearchAgent'
import { getUrlReaderNodes, getUrlReaderConnections } from './tools/urlReader'
import { getSendMailNodes, getSendMailConnections } from './tools/sendMail'
import {
  getMemoryRecallNodes,
  getMemoryRecallConnections,
} from './tools/memoryRecall'
import { createToolSendMail } from '../tool-send-mail/factory'
import { AgentCredentials } from 'server/n8n/bootstrap/interfaces'
import { WorkflowFactory } from 'server/n8n/WorkflowFactory'
import { getAgentDataNode } from './nodes/baseNodes/getAgentDataNode'
import { getReflectionWorkflowName } from '../reflection/helpers'
import { getFetchMindLogsNode } from './nodes/baseNodes/fetchMindLogsNode'
import { WorkflowFactoryProps } from 'server/n8n/WorkflowFactory/interfaces'

export abstract class AgentWorkflowFactory extends WorkflowFactory {
  // abstract agentCredentialsKey: string
  abstract getConfig(agentCredentials: AgentCredentials): AgentFactoryConfig

  protected graphqlToolNode: NodeType | null = null

  protected config: AgentFactoryConfig
  protected agentCreds: AgentCredentials

  constructor(props: WorkflowFactoryProps) {
    super(props)

    this.agentCreds = this.getCredentials()

    this.config = this.getConfig(this.agentCreds)
  }

  abstract getCredentialsKey(): string

  getCredentials() {
    const agentCredentialsKey = this.getCredentialsKey()

    return super.getCredentials(agentCredentialsKey)
  }

  hasMemory() {
    const memorySize = this.config.memorySize

    return memorySize && memorySize > 0 ? true : false
  }

  // getMemorySize() {
  //   const {
  //     memorySize = process.env.AGENT_MEMORY_SIZE === 'false'
  //       ? false
  //       : parseInt(process.env.AGENT_MEMORY_SIZE || '5'),
  //   } = this.config

  //   return memorySize || 0
  // }

  async buildWorkflow(): Promise<void> {
    const { agentName, workflowName } = this.config

    if (workflowName !== agentName) {
      throw new Error(
        `workflowName !== agentName. workflowName: "${workflowName}", agentName: "${agentName}"`,
      )
    }

    const smtp = this.agentCreds.smtp
    const hasMemoryRecall =
      this.config.hasMemoryRecall ?? this.agentCreds.hasMemoryRecall ?? false

    const fullConfig = {
      ...this.config,
      canSendMail: !!smtp,
      smtp,
      hasMemoryRecall,
    }

    // Create flow-level workflows FIRST (one per flow, not per agent)
    // so they are available in registry before createNestedFlows
    const { hasGraphqlTool = false, credentialId, credentialName } = fullConfig

    if (hasGraphqlTool) {
      const toolGraphqlRequest = createToolGraphqlRequest({
        agentName,
        credentialId,
        credentialName,
      })
      this.registry.addFlow(toolGraphqlRequest.name, toolGraphqlRequest)
    }

    // Now create nested flows (they can access flow-level workflows via registry)
    const workflows = this.createNestedFlows(fullConfig)

    // First workflow is the main one
    if (workflows.length > 0) {
      this.builtWorkflow = workflows[0]

      // Register nested workflows
      for (let i = 1; i < workflows.length; i++) {
        const nested = workflows[i]
        if (nested.name) {
          this.registry.addFlow(nested.name, nested)
        }
      }
    }
  }

  protected createNestedFlows(config: AgentFactoryConfig): AgentFactoryResult {
    const {
      agentName,
      agentDescription,
      hasEXNodes = process.env.HAS_EX_NODES === 'true',
      canSendMail = false,
      smtp,
      webhookId,
    } = config

    const reflectionWorkflow = createReflectionWorkflow({
      agentName,
      hasEXNodes,
      webhookId,
      agentDescription,
    })

    const sendMailWorkflow =
      canSendMail && smtp
        ? createToolSendMail({
            agentName,
            credentialId: smtp.credentialId,
            credentialName: smtp.credentialName,
            fromEmail: smtp.user,
            fromPassword: smtp.password,
          })
        : null

    const agentWorkflow = this.buildMainWorkflow(config)

    this.upgradeMainWorkflow(agentWorkflow, config)

    const workflows = [reflectionWorkflow, agentWorkflow]

    if (sendMailWorkflow) {
      workflows.push(sendMailWorkflow)
    }

    return workflows
  }

  buildMainWorkflow(config: AgentFactoryConfig): WorkflowBase {
    const {
      agentId,
      agentName,
      workflowName,
      versionId,
      instanceId,
      // memorySize = process.env.AGENT_MEMORY_SIZE === 'false'
      //   ? false
      //   : parseInt(process.env.AGENT_MEMORY_SIZE || '5'),
      canAccessFileSystem = false,
      canExecuteFetch = false,
      canReadUrls = false,
      hasTools = true,
      hasMindLogs = process.env.N8N_MINDLOGS_NODES === 'true',
      hasTasks = process.env.N8N_HAS_TASKS_NODES === 'true',
      hasKBNodes = process.env.N8N_HAS_KNOWLEDGES_BASE_NODES === 'true',
      hasEXNodes = process.env.HAS_EX_NODES === 'true',
      hasWebSearchAgent = false,
      hasMemoryRecall = false,
      canSendMail = false,
      // hasGraphqlTool = false,
      additionalNodes = [],
      additionalConnections = {},
    } = config

    // Tool connections
    const mindLogConnections: ConnectionsType =
      hasTools && hasMindLogs
        ? {
            'Create MindLog Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Search MindLogs Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Update MindLog Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Delete MindLog Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
          }
        : {}

    const taskConnections: ConnectionsType =
      hasTools && hasTasks
        ? {
            'Create Task Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Search Tasks Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Update Task Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Delete Task Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
          }
        : {}

    const taskWorkLogConnections: ConnectionsType =
      hasTools && hasTasks
        ? {
            'Create Task Work Log Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Search Task Work Log Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'Delete Task Work Log Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
          }
        : {}

    const kbConnections: ConnectionsType =
      hasTools && hasKBNodes
        ? {
            'KB Concept Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'KB Fact Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'KB Fact Participation Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'KB Fact Projection Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'KB Knowledge Space Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
          }
        : {}

    const exConnections: ConnectionsType =
      hasTools && hasEXNodes
        ? {
            'EX Reflex Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
            'EX Reaction Tool': {
              ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
            },
          }
        : {}

    // Tool nodes - add to this.nodes
    const codeExecutionConnections: ConnectionsType = canAccessFileSystem
      ? getCodeExecutionConnections({ agentId, agentName })
      : {}
    if (canAccessFileSystem) {
      this.addNodes(getCodeExecutionNodes({ agentId, agentName }))
    }

    const fetchRequestConnections: ConnectionsType = canExecuteFetch
      ? getFetchRequestConnections({ agentId, agentName })
      : {}
    if (canExecuteFetch) {
      this.addNodes(getFetchRequestNodes({ agentId, agentName }))
    }

    const webSearchAgentConnections: ConnectionsType = hasWebSearchAgent
      ? getWebSearchAgentConnections({ agentId, agentName })
      : {}
    if (hasWebSearchAgent) {
      this.addNodes(getWebSearchAgentNodes({ agentId, agentName }))
    }

    const urlReaderConnections: ConnectionsType = canReadUrls
      ? getUrlReaderConnections({ agentId, agentName })
      : {}
    if (canReadUrls) {
      this.addNodes(getUrlReaderNodes({ agentId, agentName }))
    }

    const memoryRecallConnections: ConnectionsType =
      hasTools && hasMemoryRecall
        ? getMemoryRecallConnections({ agentId, agentName })
        : {}
    if (hasTools && hasMemoryRecall) {
      this.addNodes(getMemoryRecallNodes({ agentId, agentName }))
    }

    const sendMailConnections: ConnectionsType = canSendMail
      ? getSendMailConnections({ agentId, agentName })
      : {}
    if (canSendMail) {
      this.addNodes(getSendMailNodes({ agentId, agentName }))
    }

    if (hasTools && hasMindLogs) {
      this.addNodes(getMindLogNodes({ agentId, agentName }))
    }

    if (hasTools && hasTasks) {
      this.addNodes(getTaskNodes({ agentId, agentName }))
      this.addNodes(getTaskWorkLogNodes({ agentId, agentName }))
    }

    if (hasTools && hasKBNodes) {
      this.addNodes(getKBNodes({ agentId, agentName }))
    }

    if (hasTools && hasEXNodes) {
      this.addNodes(getEXNodes({ agentId, agentName }))
    }

    // Core nodes
    const [triggerNodes, triggerConnections] = this.getTriggerNodes(config)
    this.addNodes(triggerNodes)

    const [outputNodes, outputConnections] = this.getOutputNodes(config)
    this.addNodes(outputNodes)

    const [agentNodes, agentConnections, mainAgentNode] =
      this.getMainAgent(config)
    this.addNodes(agentNodes)

    const [graphqlToolNode, graphqlToolConnections] = mainAgentNode
      ? this.getGraphqlToolNodesAndConnections(config, mainAgentNode)
      : [null, {}]
    if (graphqlToolNode) {
      this.addNode(graphqlToolNode)
    }

    const { agentDataNode } = this.getBaseNodes(config)

    this.addNodes(additionalNodes)

    const baseConnections: ConnectionsType = {
      ...outputConnections,
      ...agentConnections,
      ...triggerConnections,
      ...(hasTools && agentDataNode
        ? {
            'Merge Trigger': {
              main: [
                [
                  { node: agentDataNode.name, type: 'main', index: 0 },
                  { node: 'Fetch MindLogs', type: 'main', index: 0 },
                ],
              ],
            },
            [agentDataNode.name]: {
              main: [[{ node: 'Merge', type: 'main', index: 0 }]],
            },
            'Fetch MindLogs': {
              main: [[{ node: 'Merge', type: 'main', index: 1 }]],
            },
            Merge: {
              main: [[{ node: 'Prepare Context', type: 'main', index: 0 }]],
            },
            'Prepare Context': {
              main: [
                [
                  { node: 'Reflection', type: 'main', index: 0 },
                  { node: 'Merge Context', type: 'main', index: 0 },
                ],
              ],
            },
            Reflection: {
              main: [[{ node: 'Merge Context', type: 'main', index: 1 }]],
            },
            'Merge Context': {
              main: [
                [
                  {
                    node: `Prepare Agent Input (${agentId})`,
                    type: 'main',
                    index: 0,
                  },
                ],
              ],
            },
          }
        : {
            'Merge Trigger': {
              main: [[{ node: 'Prepare Context', type: 'main', index: 0 }]],
            },
            'Prepare Context': {
              main: [
                [
                  {
                    node: `Prepare Agent Input (${agentId})`,
                    type: 'main',
                    index: 0,
                  },
                ],
              ],
            },
          }),
    }

    if (this.hasMemory()) {
      baseConnections['Simple Memory'] = {
        ai_memory: [[{ node: agentName, type: 'ai_memory', index: 0 }]],
      }
    }

    const connections: ConnectionsType = {
      ...baseConnections,
      ...mindLogConnections,
      ...taskConnections,
      ...taskWorkLogConnections,
      ...kbConnections,
      ...exConnections,
      ...webSearchAgentConnections,
      ...codeExecutionConnections,
      ...fetchRequestConnections,
      ...graphqlToolConnections,
      ...urlReaderConnections,
      ...sendMailConnections,
      ...memoryRecallConnections,
      ...additionalConnections,
    }

    return {
      name: workflowName,
      active: true,
      versionId,
      nodes: this.getNodesArray(),
      connections,
      pinData: {},
      settings: {
        executionOrder: 'v1',
      },
      meta: {
        instanceId,
      },
    }
  }

  getBaseNodes(config: AgentFactoryConfig) {
    const { agentId, agentName, hasTools, hasGraphqlTool, memorySize } = config

    const hasMemory = this.hasMemory()

    const prepareContextTemplate = fs.readFileSync(
      path.join(__dirname, 'nodes/baseNodes/prepareContext.js'),
      'utf-8',
    )

    const prepareContextCode = prepareContextTemplate.replace(
      '$config',
      JSON.stringify({ agentId }, null, 2),
    )

    const agentDataNode = hasGraphqlTool
      ? getAgentDataNode({
          nodeId: `${agentId}-get-agent-data`,
          agentName,
          position: getNodeCoordinates('get-agent-data'),
        })
      : null

    const prepareContextNode: NodeType = {
      id: `${agentId}-prepare-context`,
      name: 'Prepare Context',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('prepare-context'),
      parameters: {
        jsCode: prepareContextCode,
      },
    }

    // Add nodes via this.addNode
    if (agentDataNode) {
      this.addNode(agentDataNode)
    }
    this.addNode(prepareContextNode)

    if (hasTools && agentDataNode) {
      this.addNode({
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
      })
      this.addNode({
        parameters: {},
        type: 'n8n-nodes-base.merge',
        typeVersion: 3.2,
        position: getNodeCoordinates('merge-context'),
        id: `${agentId}-merge-context`,
        name: 'Merge Context',
      })
    }

    if (hasTools) {
      this.addNode(getFetchMindLogsNode({ agentId, agentName }))
      this.addNode({
        parameters: {},
        type: 'n8n-nodes-base.merge',
        typeVersion: 3.2,
        position: getNodeCoordinates('merge'),
        id: `${agentId}-merge`,
        name: 'Merge',
      })
    }

    if (hasMemory) {
      this.addNode({
        id: `${agentId}-memory`,
        name: 'Simple Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        typeVersion: 1.3,
        position: getNodeCoordinates('memory'),
        parameters: {
          sessionIdType: 'customKey',
          sessionKey: '={{ $json.sessionId }}',
          contextWindowLength: memorySize,
        },
      })
    }

    return { agentDataNode, prepareContextNode }
  }

  upgradeMainWorkflow(
    _workflow: WorkflowBase,
    _config: AgentFactoryConfig,
  ): void {
    //
  }

  getGraphqlToolNodesAndConnections(
    config: AgentFactoryConfig,
    agentNode: NodeType,
  ): [NodeType | null, ConnectionsType] {
    const {
      agentId,
      agentName,
      hasGraphqlTool = false,
      hasTools = true,
    } = config

    if (!hasGraphqlTool || !hasTools) {
      return [null, {}]
    }

    // Create GraphQL tool node once per flow
    if (!this.graphqlToolNode) {
      const nodes = getGraphqlToolNodes({ agentId, agentName })
      this.graphqlToolNode = nodes[0] || null
    }

    if (!this.graphqlToolNode) {
      return [null, {}]
    }

    // Return connection for this specific agent
    const connections: ConnectionsType = {
      [this.graphqlToolNode.name]: {
        ai_tool: [
          [
            { node: agentNode.name, type: 'ai_tool', index: 0 },
            // {
            //   node: agentName + '-decompositor',
            //   type: 'ai_tool',
            //   index: 0,
            // },
          ],
        ],
      },
    }

    return [this.graphqlToolNode, connections]
  }

  getTriggerNodes(config: AgentFactoryConfig): [NodeType[], ConnectionsType] {
    const {
      agentId,
      agentName,
      agentDescription,
      webhookId,
      workflowInputs = [
        { name: 'chatInput', type: 'string' },
        { name: 'sessionId', type: 'string' },
        { name: 'user', type: 'object' },
      ],
      authFromToken,
    } = config

    const nodes: NodeType[] = [
      {
        parameters: {
          workflowInputs: {
            values: workflowInputs?.map((input) => ({
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
          public: true,
          mode: 'webhook',
          availableInChat: true,
          agentName,
          agentDescription,
          options: {
            allowFileUploads: true,
          },
        },
      },
    ]

    if (authFromToken) {
      nodes.push(
        {
          parameters: {
            workflowId: {
              __rl: true,
              mode: 'list',
              value: 'Tool: Get User By Token',
            },
            workflowInputs: {
              mappingMode: 'defineBelow',
              value: {
                token: '={{ $json.token }}',
              },
              matchingColumns: [],
              schema: [
                {
                  id: 'token',
                  displayName: 'token',
                  required: false,
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
          id: `${agentId}-get-user-by-token`,
          name: 'Get User By Token',
          type: 'n8n-nodes-base.executeWorkflow',
          typeVersion: 1.2,
          position: getNodeCoordinates('get-user-by-token'),
        },
        {
          id: `${agentId}-set-auth-context`,
          name: 'Set Auth Context',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: getNodeCoordinates('set-auth-context'),
          parameters: {
            jsCode: fs.readFileSync(
              path.join(__dirname, 'nodes/setAuthContext/index.js'),
              'utf-8',
            ),
          },
        },
      )
    }

    nodes.push({
      parameters: {
        jsCode: 'return $input.all()',
      },
      id: `${agentId}-merge-trigger`,
      name: 'Merge Trigger',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('merge-trigger'),
    })

    const connections: ConnectionsType = {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Merge Trigger', type: 'main', index: 0 }]],
      },
      'Webhook Trigger': {
        main: [[{ node: 'Webhook Prepare Input', type: 'main', index: 0 }]],
      },
      'Webhook Prepare Input': {
        main: [
          [
            {
              node: authFromToken ? 'Get User By Token' : 'Merge Trigger',
              type: 'main',
              index: 0,
            },
          ],
        ],
      },
      'When chat message received': {
        main: [
          [
            {
              node: authFromToken ? 'Get User By Token' : 'Merge Trigger',
              type: 'main',
              index: 0,
            },
          ],
        ],
      },
      ...(authFromToken
        ? {
            'Get User By Token': {
              main: [[{ node: 'Set Auth Context', type: 'main', index: 0 }]],
            },
            'Set Auth Context': {
              main: [[{ node: 'Merge Trigger', type: 'main', index: 0 }]],
            },
          }
        : {}),
    }

    return [nodes, connections]
  }

  getOutputNodes(config: AgentFactoryConfig): [NodeType[], ConnectionsType] {
    const { agentId, agentName, hasWorkflowOutput = false } = config

    const nodes: NodeType[] = []

    if (hasWorkflowOutput) {
      nodes.push({
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
    }

    nodes.push({
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

    nodes.push({
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

    const connections: ConnectionsType = {
      [agentName]: hasWorkflowOutput
        ? { main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]] }
        : { main: [[{ node: 'If Not Streaming', type: 'main', index: 0 }]] },
      ...(hasWorkflowOutput
        ? {
            'Workflow Output': {
              main: [[{ node: 'If Not Streaming', type: 'main', index: 0 }]],
            },
          }
        : {}),
      'If Not Streaming': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }], []],
      },
    }

    return [nodes, connections]
  }

  // getAgentNodes(params: {
  //   agentId: string
  //   agentName: string
  //   agentNodeType?: 'orchestrator' | 'default'
  //   enableStreaming?: boolean
  //   maxIterations?: number
  //   model?: string
  //   systemMessage: string
  //   prepareAgentInputCode: string
  //   hasTools?: boolean
  // }): [NodeType[], ConnectionsType] {

  getPrepareContextNode(_config: AgentFactoryConfig) {
    //
  }

  getAgentNodes(
    config: AgentFactoryConfig & {
      systemMessage: string | undefined
      prepareAgentInputCode: string
      position: [number, number]
    },
  ): [NodeType[], ConnectionsType, agentNode: NodeType] {
    const {
      agentId,
      agentName,
      agentNodeType = 'orchestrator',
      enableStreaming = true,
      maxIterations = parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
      model,
      systemMessage,
      prepareAgentInputCode,
      hasTools = true,
      position,
    } = config

    const agentNode = createAgentNode({
      agentId,
      agentName,
      agentNodeType,
      enableStreaming,
      maxIterations,
      model,
      systemMessage,
      hasTools,
      position,
    })

    const nodes: NodeType[] = [
      {
        parameters: {
          jsCode: prepareAgentInputCode,
        },
        id: `${agentId}-prepare-agent-input`,
        name: `Prepare Agent Input (${agentId})`,
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [position[0] - 150, position[1]],
      },
      agentNode,
    ]

    if (agentNodeType !== 'orchestrator') {
      nodes.push({
        parameters: {
          model,
          options: {},
        },
        id: `${agentId}-chat-model`,
        name: `Chat Model (${agentId})`,
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        typeVersion: 1,
        position,
        credentials: {
          openRouterApi: {
            id: 'FsN0N48lU327xkz6',
            name: 'OpenRouter',
          },
        },
      })
    }

    const connections: ConnectionsType = {
      [`Prepare Agent Input (${agentId})`]: {
        main: [[{ node: agentName, type: 'main', index: 0 }]],
      },
      ...(agentNodeType !== 'orchestrator' && {
        [`Chat Model (${agentId})`]: {
          ai_languageModel: [
            [{ node: agentName, type: 'ai_languageModel', index: 0 }],
          ],
        },
      }),
    }

    return [nodes, connections, agentNode]
  }

  getMainAgent(
    config: AgentFactoryConfig,
  ): [NodeType[], ConnectionsType, agentNode: NodeType] {
    const prepareAgentInputCode = fs.readFileSync(
      path.join(__dirname, 'nodes/baseNodes/prepareAgentInput.js'),
      'utf-8',
    )

    return this.getAgentNodes({
      // agentId,
      // agentName,
      // agentNodeType,
      // enableStreaming,
      // maxIterations,
      // model,
      // hasTools,
      ...config,
      prepareAgentInputCode,
      // position: [256, 520],
      position: [112, 304],
    })
  }
}

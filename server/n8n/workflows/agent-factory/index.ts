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
import { WorkflowBase, WorkflowFactory, CredentialsMap } from '../interfaces'
import { getModel } from '../helpers'
import { getBaseNodes } from './nodes/baseNodes'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'
import {
  getCodeExecutionNodes,
  getCodeExecutionConnections,
} from './tools/codeExecution'
import {
  getFetchRequestNodes,
  getFetchRequestConnections,
} from './tools/fetchRequest'
import { getGraphqlToolNodes, getGraphqlToolConnections } from './tools/graphql'
import {
  getWebSearchAgentNodes,
  getWebSearchAgentConnections,
} from './tools/webSearchAgent'
import { getUrlReaderNodes, getUrlReaderConnections } from './tools/urlReader'
import { getSendMailNodes, getSendMailConnections } from './tools/sendMail'
import { createToolSendMail } from '../tool-send-mail/factory'
import { AgentCredentials } from 'server/n8n/bootstrap/interfaces'

export abstract class AgentWorkflowFactory extends WorkflowFactory {
  abstract agentCredentialsKey: string
  abstract getConfig(agentCredentials: AgentCredentials): AgentFactoryConfig

  async createWorkflow(credentials: CredentialsMap): Promise<WorkflowBase[]> {
    const agentCreds = credentials[this.agentCredentialsKey] as unknown as
      | AgentCredentials
      | undefined

    if (!agentCreds) {
      throw new Error(
        `Agent credentials not found for key: ${this.agentCredentialsKey}`,
      )
    }

    const config = this.getConfig(agentCreds)

    const { agentName, workflowName } = config

    if (workflowName !== agentName) {
      throw new Error(
        `workflowName !== agentName. workflowName: "${workflowName}", agentName: "${agentName}"`,
      )
    }

    const smtp = agentCreds.smtp

    return createAgent({
      ...config,
      canSendMail: !!smtp,
      smtp,
    })
  }
}

export function createAgent(config: AgentFactoryConfig): AgentFactoryResult {
  const {
    agentId,
    agentName,
    agentDescription,
    workflowName,
    versionId,
    credentialId,
    credentialName,
    instanceId,
    hasWorkflowOutput = true,
    memorySize = process.env.AGENT_MEMORY_SIZE === 'false'
      ? false
      : parseInt(process.env.AGENT_MEMORY_SIZE || '5'),
    canAccessFileSystem = false,
    canExecuteFetch = false,
    canReadUrls = true,
    authFromToken = false,
    hasGraphqlTool = true,
    hasTools = true,
    hasMindLogs = process.env.N8N_MINDLOGS_NODES === 'true',
    hasTasks = process.env.N8N_HAS_TASKS_NODES === 'true',
    hasKBNodes = process.env.N8N_HAS_KNOWLEDGES_BASE_NODES === 'true',
    hasEXNodes = process.env.HAS_EX_NODES === 'true',
    hasWebSearchAgent = false,
    canSendMail = false,
    smtp,
    additionalNodes = [],
    additionalConnections = {},
    systemMessagePath,
    webhookId,
    model = getModel(),
    maxIterations = parseInt(process.env.N8N_MAX_ITERATIONS || '10'),
    agentNodeType = 'orchestrator',
    enableStreaming = true,
    workflowInputs = [
      { name: 'chatInput', type: 'string' },
      { name: 'sessionId', type: 'string' },
      { name: 'user', type: 'object' },
    ],
  } = config

  const hasMemory = typeof memorySize === 'number' && memorySize > 0

  const toolGraphqlRequest = createToolGraphqlRequest({
    agentName,
    credentialId,
    credentialName,
  })

  const reflectionWorkflow = createReflectionWorkflow({
    agentName,
    hasEXNodes,
  })

  const authNodes: NodeType[] = authFromToken
    ? [
        {
          parameters: {
            workflowId: {
              __rl: true,
              mode: 'list' as const,
              value: 'Tool: Get User By Token',
            },
            workflowInputs: {
              mappingMode: 'defineBelow' as const,
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
      ]
    : []

  const authConnections: ConnectionsType = authFromToken
    ? {
        'Get User By Token': {
          main: [[{ node: 'Set Auth Context', type: 'main', index: 0 }]],
        },
        'Set Auth Context': {
          main: [[{ node: 'Merge Trigger', type: 'main', index: 0 }]],
        },
      }
    : {}

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

  const codeExecutionNodes: NodeType[] = canAccessFileSystem
    ? getCodeExecutionNodes({ agentId, agentName })
    : []

  const codeExecutionConnections: ConnectionsType = canAccessFileSystem
    ? getCodeExecutionConnections({ agentId, agentName })
    : {}

  const fetchRequestNodes: NodeType[] = canExecuteFetch
    ? getFetchRequestNodes({ agentId, agentName })
    : []

  const fetchRequestConnections: ConnectionsType = canExecuteFetch
    ? getFetchRequestConnections({ agentId, agentName })
    : {}

  const graphqlToolNodes: NodeType[] =
    hasGraphqlTool && hasTools
      ? getGraphqlToolNodes({ agentId, agentName })
      : []

  const graphqlToolConnections: ConnectionsType =
    hasGraphqlTool && hasTools
      ? getGraphqlToolConnections({ agentId, agentName })
      : {}

  const webSearchAgentNodes: NodeType[] = hasWebSearchAgent
    ? getWebSearchAgentNodes({ agentId, agentName })
    : []

  const webSearchAgentConnections: ConnectionsType = hasWebSearchAgent
    ? getWebSearchAgentConnections({ agentId, agentName })
    : {}

  const urlReaderNodes: NodeType[] = canReadUrls
    ? getUrlReaderNodes({ agentId, agentName })
    : []

  const urlReaderConnections: ConnectionsType = canReadUrls
    ? getUrlReaderConnections({ agentId, agentName })
    : {}

  const sendMailNodes: NodeType[] = canSendMail
    ? getSendMailNodes({ agentId, agentName })
    : []

  const sendMailConnections: ConnectionsType = canSendMail
    ? getSendMailConnections({ agentId, agentName })
    : {}

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

  const mindLogNodes =
    hasTools && hasMindLogs
      ? getMindLogNodes({
          agentId,
          agentName,
        })
      : []

  const taskNodes =
    hasTools && hasTasks
      ? getTaskNodes({
          agentId,
          agentName,
        })
      : []

  const taskWorkLogNodes =
    hasTools && hasTasks
      ? getTaskWorkLogNodes({
          agentId,
          agentName,
        })
      : []

  const kbNodes =
    hasTools && hasKBNodes
      ? getKBNodes({
          agentId,
          agentName,
        })
      : []

  const exNodes =
    hasTools && hasEXNodes
      ? getEXNodes({
          agentId,
          agentName,
        })
      : []

  const { nodes: baseNodes, agentDataNode } = getBaseNodes({
    agentId,
    agentName,
    agentDescription,
    agentNodeType,
    enableStreaming,
    hasMemory,
    hasTools,
    hasWorkflowOutput,
    maxIterations,
    memorySize,
    model,
    systemMessagePath,
    webhookId,
    workflowInputs,
    hasToolsParam: hasTools,
  })

  const nodes: NodeType[] = [
    ...baseNodes,
    ...authNodes,
    ...mindLogNodes,
    ...taskNodes,
    ...taskWorkLogNodes,
    ...kbNodes,
    ...exNodes,
    ...webSearchAgentNodes,
    ...codeExecutionNodes,
    ...fetchRequestNodes,
    ...graphqlToolNodes,
    ...urlReaderNodes,
    ...sendMailNodes,
    ...additionalNodes,
  ]

  const baseConnections: ConnectionsType = {
    [agentName]: hasWorkflowOutput
      ? { main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]] }
      : { main: [] },
    ...(hasWorkflowOutput && {
      'Workflow Output': {
        main: [[{ node: 'If Not Streaming', type: 'main', index: 0 }]],
      },
      'If Not Streaming': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }], []],
      },
    }),
    ...(agentNodeType !== 'orchestrator' && {
      'Chat Model': {
        ai_languageModel: [
          [{ node: agentName, type: 'ai_languageModel', index: 0 }],
        ],
      },
    }),
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
    ...(hasTools
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
            main: [[{ node: 'Prepare Agent Input', type: 'main', index: 0 }]],
          },
          'Prepare Agent Input': {
            main: [[{ node: agentName, type: 'main', index: 0 }]],
          },
        }
      : {
          'Merge Trigger': {
            main: [[{ node: agentDataNode.name, type: 'main', index: 0 }]],
          },
          [agentDataNode.name]: {
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
            main: [[{ node: agentName, type: 'main', index: 0 }]],
          },
        }),
  }

  if (hasMemory) {
    baseConnections['Simple Memory'] = {
      ai_memory: [[{ node: agentName, type: 'ai_memory', index: 0 }]],
    }
  }

  const connections: ConnectionsType = {
    ...baseConnections,
    ...authConnections,
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
    ...additionalConnections,
  }

  const agentWorkflow: WorkflowBase = {
    name: workflowName,
    active: true,
    versionId,
    nodes,
    connections,
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId,
    },
  }

  const workflows = [toolGraphqlRequest, reflectionWorkflow, agentWorkflow]
  if (sendMailWorkflow) {
    workflows.push(sendMailWorkflow)
  }
  return workflows
}

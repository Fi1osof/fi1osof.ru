import { AgentWorkflowFactory } from '../agent-factory'
import {
  AgentFactoryConfig,
  ConnectionsType,
  NodeType,
} from '../agent-factory/interfaces'
import { getModel } from '../helpers'
import { AgentCredentials } from 'server/n8n/bootstrap/interfaces'
import { WorkflowBase } from '../interfaces'
import { getDecompositor } from './nodes/decompositor'
import { getMainAgent } from './nodes/mainAgent'
import { createToolCreateConcept } from './nodes/KB/KBConcept/createConcept'
import { createToolReadConcepts } from './nodes/KB/KBConcept/readConcepts'
import { createToolUpdateConcept } from './nodes/KB/KBConcept/updateConcept'
import { createToolDeleteConcept } from './nodes/KB/KBConcept/deleteConcept'
import { createToolExecTool } from '../tool-exec-tool/factory'
import { getExecTools } from './nodes/execTool'

class ChatAgentWorkflow extends AgentWorkflowFactory {
  getCredentialsKey() {
    return 'agents/agent-chat'
  }

  getConfig(agentCreds: AgentCredentials): AgentFactoryConfig {
    const {
      password: _password,
      username: _username,
      email: _email,
      fullname: _fullname,
      imap: _imap,
      smtp: _smtp,
      agentName,
      model,
      ...other
    } = agentCreds

    const memorySize =
      process.env.AGENT_MEMORY_SIZE === 'false'
        ? false
        : parseInt(process.env.AGENT_MEMORY_SIZE || '5')

    return {
      agentName,
      agentDescription: 'Main chat agent. Handles user conversations.',
      agentId: 'chat-agent',
      workflowName: agentName,
      versionId: 'agent-chat-v7',
      credentialId: 'internal-agent-chat-cred',
      credentialName: 'Internal API - agent-chat',
      systemMessagePath: undefined,
      webhookId: 'agent-chat-webhook',
      instanceId: 'narasim-dev-agent-chat',
      agentNodeType: 'orchestrator',
      model: model || getModel(process.env.AGENT_CHAT_MODEL),
      memorySize,
      ...other,
    }
  }

  buildMainWorkflow(config: AgentFactoryConfig): WorkflowBase {
    const { workflowName, versionId, instanceId, agentId } = config

    // Trigger nodes
    const [triggerNodes, triggerConnections] = this.getTriggerNodes(config)
    this.addNodes(triggerNodes)

    // Main agent nodes
    const [agentNodes, agentConnections, mainAgentNode] =
      this.getMainAgent(config)

    this.addNodes(agentNodes)

    // GraphQL tool
    const [graphqlToolNode, graphqlToolConnectionsMain] =
      this.getGraphqlToolNodesAndConnections(config, mainAgentNode)
    if (graphqlToolNode) {
      this.addNode(graphqlToolNode)
    }

    // Exec Tools - прокси для вызова инструментов с обоснованием
    const execTools = getExecTools(config)
    this.addNodes(execTools)

    this.addNode({
      id: `${agentId}-merge-agent-data`,
      name: 'Merge Agent Data',
      type: 'n8n-nodes-base.merge',
      typeVersion: 3,
      position: [
        mainAgentNode.position[0] - 1168,
        mainAgentNode.position[1] + 16,
      ],
      parameters: {
        numberInputs: 2,
      },
    })

    this.addNode({
      id: `${agentId}-prepare-agent-data`,
      name: 'Prepare Agent Data',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [
        mainAgentNode.position[0] - 928,
        mainAgentNode.position[1] + 16,
      ],
      parameters: {
        jsCode: `const items = $input.all()
const agentData = items[0]?.json?.data?.me || null
const mindLogs = items[1]?.json?.data?.response || []

return {
  agentData,
  mindLogs,
}`,
      },
    })

    // Merge node to collect results from decompositor, useful-info agents, and agent data
    this.addNode({
      id: `${agentId}-merge-agents`,
      name: 'Merge Agents',
      type: 'n8n-nodes-base.merge',
      typeVersion: 3,
      position: [
        mainAgentNode.position[0] - 432,
        mainAgentNode.position[1] - 16,
      ],
      parameters: {
        numberInputs: 3,
      },
    })

    // Output nodes
    const [outputNodes, outputConnections] = this.getOutputNodes({
      ...config,
      hasWorkflowOutput: true,
    })
    this.addNodes(outputNodes)

    // Save conversation node
    this.addNode({
      id: `${agentId}-save-conversation`,
      name: 'Save Conversation',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [2672, -368],
      parameters: {
        source: 'database',
        workflowId: {
          __rl: true,
          mode: 'name',
          value: 'Tool: Add Conversation',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            userId: '={{ $json.user?.id || "" }}',
            sessionId: '={{ $json.sessionId || "" }}',
            chatInput: '={{ $json.chatInput || "" }}',
            response: '={{ $json.output || "" }}',
          },
        },
      },
    })

    // Base nodes (prepareContext)
    const { prepareContextNode } = this.getBaseNodes(config)

    // Get references to nodes for connections
    const agentNodesFirst = agentNodes.at(0)
    const triggerNodesLast = triggerNodes.at(-1)

    const connections: ConnectionsType = {
      ...triggerConnections,
      ...(triggerNodesLast &&
        prepareContextNode && {
          [triggerNodesLast.name]: {
            main: [
              [
                {
                  node: prepareContextNode.name,
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
        }),
      [this.nodes['Merge Agent Data'].name]: {
        main: [
          [
            {
              node: this.nodes['Prepare Agent Data'].name,
              type: 'main',
              index: 0,
            },
          ],
        ],
      },
      [this.nodes['Prepare Agent Data'].name]: {
        main: [
          [{ node: this.nodes['Merge Agents'].name, type: 'main', index: 2 }],
        ],
      },
      ...(agentNodesFirst && {
        [this.nodes['Merge Agents'].name]: {
          main: [[{ node: agentNodesFirst.name, type: 'main', index: 0 }]],
        },
      }),
      ...agentConnections,
      ...graphqlToolConnectionsMain,
      ...outputConnections,
      ...Object.fromEntries(
        execTools.map((tool) => [
          tool.name,
          {
            ai_tool: [
              [{ node: mainAgentNode.name, type: 'ai_tool', index: 0 }],
            ],
          },
        ]),
      ),

      ...{
        [this.nodes['Prepare Context'].name]: {
          main: [
            [
              {
                node: 'Prepare Agent Input (chat-agent)',
                type: 'main',
                index: 0,
              },
            ],
          ],
        },
      },
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

  getDecompositor(config: AgentFactoryConfig, mainAgentNode: NodeType) {
    return getDecompositor({
      config,
      mainAgentNode,
    })
  }

  getMainAgent(
    config: AgentFactoryConfig,
  ): [NodeType[], ConnectionsType, agentNode: NodeType] {
    return getMainAgent({ config, hasMemory: this.hasMemory() })
  }

  protected createNestedFlows(config: AgentFactoryConfig): WorkflowBase[] {
    const workflows = super.createNestedFlows(config)

    const saveConceptWorkflow = createToolCreateConcept(config)
    saveConceptWorkflow && workflows.push(saveConceptWorkflow)

    const readConceptsWorkflow = createToolReadConcepts(config)
    readConceptsWorkflow && workflows.push(readConceptsWorkflow)

    const updateConceptWorkflow = createToolUpdateConcept(config)
    updateConceptWorkflow && workflows.push(updateConceptWorkflow)

    const deleteConceptWorkflow = createToolDeleteConcept(config)
    deleteConceptWorkflow && workflows.push(deleteConceptWorkflow)

    const execToolWorkflow = createToolExecTool({
      agentName: config.agentName,
    })
    workflows.push(execToolWorkflow)

    return workflows
  }
}

export default ChatAgentWorkflow

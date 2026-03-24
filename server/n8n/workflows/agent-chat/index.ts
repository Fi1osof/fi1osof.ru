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
import { getUsefulInfoAgent } from './nodes/usefulInfoAgent'

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
      ...other,
    }
  }

  buildMainWorkflow(config: AgentFactoryConfig): WorkflowBase {
    const { workflowName, versionId, instanceId, agentId } = config

    const [triggerNodes, triggerConnections] = this.getTriggerNodes(config)
    const [agentNodes, agentConnections, mainAgentNode] =
      this.getMainAgent(config)

    const [graphqlToolNode, graphqlToolConnectionsMain] =
      this.getGraphqlToolNodesAndConnections(config, mainAgentNode)

    const {
      decompositorAgentNodes,
      decompositorAgentConnections,
      mergeToolsNode,
      decompositorAgentNode,
    } = this.getDecompositor(config, mainAgentNode)

    const {
      usefulInfoAgentNodes,
      usefulInfoAgentConnections,
      prepareAgentInputNode: usefulInfoPrepareNode,
      usefulInfoAgentNode,
    } = getUsefulInfoAgent({ config, mainAgentNode, mergeToolsNode })

    // Add connection from mergeToolsNode to usefulInfoAgent
    decompositorAgentConnections[mergeToolsNode.name]?.main[0]?.push({
      node: usefulInfoPrepareNode.name,
      type: 'main',
      index: 0,
    })

    // Merge node to collect results from decompositor and useful-info agents
    const mergeAgentsNode: NodeType = {
      id: `${agentId}-merge-agents`,
      name: 'Merge Agents',
      type: 'n8n-nodes-base.merge',
      typeVersion: 3,
      position: [mainAgentNode.position[0] - 300, mainAgentNode.position[1]],
      parameters: {
        numberInputs: 2,
      },
    }

    const [outputNodes, outputConnections] = this.getOutputNodes({
      ...config,
      hasWorkflowOutput: true,
    })

    const saveConversationNode: NodeType = {
      id: `${agentId}-save-conversation`,
      name: 'Save Conversation',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [700, 50],
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
    }

    const { prepareContextNode } = this.getBaseNodes(config)
    prepareContextNode.position = [
      prepareContextNode.position[0] - 400,
      prepareContextNode.position[1],
    ]

    const nodes: NodeType[] = [
      ...triggerNodes,
      prepareContextNode,
      ...decompositorAgentNodes,
      ...usefulInfoAgentNodes,
      mergeAgentsNode,
      ...agentNodes,
      ...(graphqlToolNode ? [graphqlToolNode] : []),
      ...outputNodes,
      saveConversationNode,
    ]

    const agentNodesFirst = agentNodes.at(0)
    const triggerNodesLast = triggerNodes.at(-1)
    const decompositorAgentNodesFirst = decompositorAgentNodes.at(0)

    outputConnections[mainAgentNode.name].main[0]?.push({
      node: saveConversationNode.name,
      type: 'main',
      index: 0,
    })

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
      ...(prepareContextNode &&
        decompositorAgentNodesFirst && {
          [prepareContextNode.name]: {
            main: [
              [
                {
                  node: decompositorAgentNodesFirst.name,
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
        }),
      ...decompositorAgentConnections,
      ...usefulInfoAgentConnections,
      // decompositor and useful-info agents to Merge
      [decompositorAgentNode.name]: {
        main: [[{ node: mergeAgentsNode.name, type: 'main', index: 0 }]],
      },
      [usefulInfoAgentNode.name]: {
        main: [[{ node: mergeAgentsNode.name, type: 'main', index: 1 }]],
      },
      // Merge to Prepare Agent Input (chat-agent)
      ...(agentNodesFirst && {
        [mergeAgentsNode.name]: {
          main: [[{ node: agentNodesFirst.name, type: 'main', index: 0 }]],
        },
      }),
      ...agentConnections,
      ...graphqlToolConnectionsMain,
      ...outputConnections,
    }

    return {
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
    return getMainAgent({ config })
  }

  upgradeMainWorkflow(workflow: WorkflowBase, config: AgentFactoryConfig) {
    super.upgradeMainWorkflow(workflow, config)

    const getUserByTokenConnections = workflow.connections['Get User By Token']

    if (!getUserByTokenConnections) {
      throw new Error('Can not get getUserByTokenConnections')
    }

    getUserByTokenConnections.main[0]?.push({
      type: 'main',
      node: 'Merge Tools',
      index: 3,
    })
  }
}

export default ChatAgentWorkflow

import * as path from 'path'
import { AgentWorkflowFactory } from '../agent-factory'
import { AgentFactoryConfig } from '../agent-factory/interfaces'
import { getModel } from '../helpers'
import { AgentCredentials } from 'server/n8n/bootstrap/interfaces'

class ChatAgentWorkflow extends AgentWorkflowFactory {
  agentCredentialsKey = 'agents/agent-chat'

  getConfig(agentCreds: AgentCredentials): AgentFactoryConfig {
    const { agentName } = agentCreds

    return {
      agentName,
      agentDescription: 'Main chat agent. Handles user conversations.',
      agentId: 'chat-agent',
      workflowName: agentName,
      versionId: 'agent-chat-v7',
      credentialId: 'internal-agent-chat-cred',
      credentialName: 'Internal API - agent-chat',
      systemMessagePath: path.join(__dirname, 'system-message.md'),
      webhookId: 'agent-chat-webhook',
      instanceId: 'narasim-dev-agent-chat',
      model: getModel(process.env.AGENT_CHAT_MODEL),
      hasWorkflowOutput: true,
      authFromToken: true,
      agentNodeType: 'orchestrator',
      hasWebSearchAgent: true,
      canExecuteFetch: true,
      canAccessFileSystem: false,
    }
  }
}

export default ChatAgentWorkflow

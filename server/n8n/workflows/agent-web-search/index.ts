import * as path from 'path'
import { AgentWorkflowFactory } from '../agent-factory'
import { AgentFactoryConfig } from '../agent-factory/interfaces'
import { AgentCredentials } from 'server/n8n/bootstrap/interfaces'

class WebSearchAgentWorkflow extends AgentWorkflowFactory {
  agentCredentialsKey = 'agents/agent-web-search'

  getConfig(agentCreds: AgentCredentials): AgentFactoryConfig {
    const { agentName } = agentCreds

    return {
      agentName,
      agentDescription:
        'Specialized agent for web search and research using Perplexity Sonar. Provides real-time information from the internet with citations.',
      agentId: 'web-search-agent',
      workflowName: agentName,
      versionId: 'agent-web-search-v1',
      credentialId: 'internal-agent-web-search-cred',
      credentialName: 'Internal API - agent-web-search',
      systemMessagePath: path.join(__dirname, 'system-message.md'),
      webhookId: 'agent-web-search-chat',
      instanceId: 'narasim-dev-web-search',
      model: 'perplexity/sonar-reasoning-pro',
      hasTools: false,
      canReadUrls: false,
      memorySize: 0,
      workflowInputs: [
        { name: 'chatInput', type: 'string' },
        { name: 'sessionId', type: 'string' },
        { name: 'user', type: 'object' },
      ],
    }
  }
}

export default WebSearchAgentWorkflow

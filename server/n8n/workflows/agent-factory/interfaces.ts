import { SmtpConfig } from 'server/n8n/bootstrap/interfaces'
import { WorkflowBase } from '../interfaces'

export type NodeType = WorkflowBase['nodes'][number]
export type ConnectionsType = WorkflowBase['connections']

export interface WorkflowInputValue {
  name: string
  type?: 'string' | 'object' | 'number' | 'boolean' | 'any'
  default?: string | number | boolean
}

export interface AgentFactoryConfig {
  agentName: string
  agentDescription: string
  agentId: string
  workflowName: string
  versionId: string
  credentialId: string
  credentialName: string
  systemMessagePath: string
  webhookId: string
  instanceId: string
  workflowInputs?: WorkflowInputValue[]
  hasWorkflowOutput?: boolean
  model?: string
  maxIterations?: number
  memorySize?: number | false
  canAccessFileSystem?: boolean
  canExecuteFetch?: boolean
  canReadUrls?: boolean
  authFromToken?: boolean
  hasGraphqlTool?: boolean
  hasTools?: boolean
  hasMindLogs?: boolean
  hasTasks?: boolean
  hasKBNodes?: boolean
  hasEXNodes?: boolean
  hasWebSearchAgent?: boolean
  canSendMail?: boolean
  smtp?: SmtpConfig
  additionalNodes?: NodeType[]
  additionalConnections?: ConnectionsType
  agentNodeType?: 'default' | 'orchestrator'
  /**
   * Enable streaming responses.
   * WARNING: When enableStreaming=false, agent executes correctly but returns empty response.
   * This is a known n8n issue with response waiting — affects both custom and native AI Agent nodes.
   */
  enableStreaming?: boolean
}

export type AgentFactoryResult = WorkflowBase[]

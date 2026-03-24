import { SmtpConfig } from 'server/n8n/bootstrap/interfaces'
import { WorkflowBase, WorkflowName } from '../interfaces'

export type NodeType = WorkflowBase['nodes'][number]
export type ConnectionsType = WorkflowBase['connections']

export interface WorkflowInputValue {
  name: string
  type?: 'string' | 'object' | 'number' | 'boolean' | 'any'
  default?: string | number | boolean
}

export interface AgentFactoryConfig {
  /** Display name of the agent */
  agentName: string
  /** Agent description for system context */
  agentDescription: string
  /** Unique agent identifier */
  agentId: string
  /** Workflow name in n8n */
  workflowName: WorkflowName
  /** Workflow version identifier */
  versionId: string
  /** Internal API credential ID */
  credentialId: string
  /** Internal API credential display name */
  credentialName: string
  /** Path to system message markdown file */
  systemMessagePath: string | undefined
  /** Webhook endpoint ID */
  webhookId: string
  /** n8n instance identifier */
  instanceId: string
  /** Custom workflow input parameters */
  workflowInputs?: WorkflowInputValue[]
  /** Enable workflow output node */
  hasWorkflowOutput?: boolean
  /** AI model to use (e.g., 'anthropic/claude-sonnet-4') */
  model?: string
  /** Maximum tool execution iterations */
  maxIterations?: number
  /** Conversation memory size (false to disable) */
  memorySize?: number | false
  /** Enable file system access tools */
  canAccessFileSystem?: boolean
  /** Enable HTTP fetch tool */
  canExecuteFetch?: boolean
  /** Enable URL reading tool */
  canReadUrls?: boolean
  /** Authenticate user from JWT token */
  authFromToken?: boolean
  /** Enable GraphQL API tool */
  hasGraphqlTool?: boolean
  /** Enable tool calling capability */
  hasTools?: boolean
  /** Enable MindLogs access */
  hasMindLogs?: boolean
  /** Enable Tasks tool */
  hasTasks?: boolean
  /** Enable Knowledge Base nodes */
  hasKBNodes?: boolean
  /** Enable Experience nodes */
  hasEXNodes?: boolean
  /** Enable Web Search Agent tool */
  hasWebSearchAgent?: boolean
  /** Enable Memory Recall tool (query tool calls history) */
  hasMemoryRecall?: boolean
  /** Enable Send Mail tool */
  canSendMail?: boolean
  /** SMTP configuration for email sending */
  smtp?: SmtpConfig
  /** Additional custom nodes to include */
  additionalNodes?: NodeType[]
  /** Additional custom connections */
  additionalConnections?: ConnectionsType
  /** Agent node type: 'default' or 'orchestrator' */
  agentNodeType?: 'default' | 'orchestrator'
  /**
   * Enable streaming responses.
   * WARNING: When enableStreaming=false, agent executes correctly but returns empty response.
   * This is a known n8n issue with response waiting — affects both custom and native AI Agent nodes.
   */
  enableStreaming?: boolean
}

export type AgentFactoryResult = WorkflowBase[]

import type { IWorkflowBase } from 'n8n-workflow'

export type WorkflowBase = Omit<
  IWorkflowBase,
  'id' | 'isArchived' | 'createdAt' | 'updatedAt' | 'activeVersionId' | 'name'
> & {
  name: WorkflowName
}

export type CredentialsMap = Record<
  string,
  Record<string, unknown> & {
    id: string | undefined
    type: string | undefined
    name: string | undefined
  }
>

/**
 * Known workflow names for type-safe references.
 * Use template literal types for dynamic agent-specific workflows.
 */
export type WorkflowName =
  // Agents
  | 'Chat Agent'
  | 'Web Search Agent'
  // Telegram
  | 'Telegram handler'
  | 'AI-Guild Telegram handler'
  | 'AI-Guild Telegram Bot API'
  | 'AI-Guild Create Invite Link'
  // Tools
  | 'Tool: Read File'
  | 'Tool: List Files'
  | 'Tool: Fetch Request'
  | 'Tool: Shell Execute'
  | 'Tool: Parsing HTML'
  | 'Tool: Verify Token'
  | 'Tool: Get Config'
  | 'Tool: Get User Data'
  | 'Tool: Get User By Token'
  | 'Tool: GraphQL Request With Token (User)'
  | 'Tool: Send Message (MCP)'
  | 'Tool: Upsert User'
  // System
  | 'Memory Recall'
  | 'MCP Server'
  | 'Error Handler'
  | 'Loop: Handler'
  | 'Loop: Runner'
  | 'Test: Execute Script'
  // Dynamic agent-specific workflows
  | `Tool: Check Mail (${string})`
  | `Tool: Send Mail (${string})`
  | `Tool: GraphQL Request (${string})`
  | `Reflection (${string})`
  // Agent World
  | 'Agent World'
  | 'Tool: Agent World'
  | 'Tool: Add Conversation'
  // Other
  | `Tool: Create Concept (${string})`
  | `Tool: Read Concepts (${string})`
  | `Tool: Update Concept (${string})`
  | `Tool: Delete Concept (${string})`
  | `Tool: Exec Tool (${string})`

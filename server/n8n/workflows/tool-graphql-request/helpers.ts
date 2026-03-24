import type { WorkflowName } from '../interfaces'

export function getGraphqlRequestWorkflowName(
  agentName: string,
): `Tool: GraphQL Request (${string})` {
  return `Tool: GraphQL Request (${agentName})` satisfies WorkflowName
}

import type { WorkflowName } from '../interfaces'

export function getSendMailWorkflowName(
  agentName: string,
): `Tool: Send Mail (${string})` {
  return `Tool: Send Mail (${agentName})` satisfies WorkflowName
}

import type { WorkflowName } from '../interfaces'

export function getCheckMailWorkflowName(
  agentName: string,
): `Tool: Check Mail (${string})` {
  return `Tool: Check Mail (${agentName})` satisfies WorkflowName
}

import type { WorkflowName } from '../interfaces'

export function getReflectionWorkflowName(
  agentName: string,
): `Reflection (${string})` {
  return `Reflection (${agentName})` satisfies WorkflowName
}

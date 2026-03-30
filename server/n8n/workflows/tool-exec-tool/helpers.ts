export function getExecToolWorkflowName(
  agentName: string,
): `Tool: Exec Tool (${string})` {
  return `Tool: Exec Tool (${agentName})` as const
}

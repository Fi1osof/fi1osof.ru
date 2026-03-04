import { WorkflowBase, WorkflowFactory, CredentialsMap } from '../interfaces'
import { createToolCheckMail } from './factory'

interface AgentCreds {
  agentName: string
  imap?: {
    credentialId: string
    credentialName: string
  }
}

class CheckMailWorkflow extends WorkflowFactory {
  async createWorkflow(credentials: CredentialsMap): Promise<WorkflowBase[]> {
    const workflows: WorkflowBase[] = []

    for (const [key, creds] of Object.entries(credentials)) {
      if (!key.startsWith('agents/')) {
        continue
      }

      const agentCreds = creds as unknown as AgentCreds | undefined
      if (!agentCreds?.imap || !agentCreds.agentName) {
        continue
      }

      const agentName = agentCreds.agentName
      const agentWorkflowName = agentName

      workflows.push(
        createToolCheckMail({
          agentName,
          agentWorkflowName,
          imapCredentialId: agentCreds.imap.credentialId,
          imapCredentialName: agentCreds.imap.credentialName,
        }),
      )
    }

    return workflows
  }
}

export default CheckMailWorkflow

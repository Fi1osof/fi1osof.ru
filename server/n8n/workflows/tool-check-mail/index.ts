import { WorkflowFactory } from 'server/n8n/WorkflowFactory'
import { createToolCheckMail } from './factory'

interface AgentCreds {
  agentName: string
  imap?: {
    credentialId: string
    credentialName: string
  }
}

class CheckMailWorkflow extends WorkflowFactory {
  async buildWorkflow(): Promise<void> {
    const credentials = this.registry.getCredentialsMap()

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

      const workflow = createToolCheckMail({
        agentName,
        agentWorkflowName,
        imapCredentialId: agentCreds.imap.credentialId,
        imapCredentialName: agentCreds.imap.credentialName,
      })

      // First workflow is the main one, rest are registered as nested
      if (!this.builtWorkflow) {
        this.builtWorkflow = workflow
      } else {
        this.registry.addFlow(workflow.name, workflow)
      }
    }
  }
}

export default CheckMailWorkflow

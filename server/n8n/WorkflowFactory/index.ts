import { AgentCredentials } from '../bootstrap/interfaces'
import { CredentialsMap, WorkflowBase } from '../workflows/interfaces'
import type { WorkflowRegistry } from '../WorkflowRegistry'
import { WorkflowFactoryProps } from './interfaces'

export abstract class WorkflowFactory {
  credentialId: string | undefined

  credentialsMap: CredentialsMap

  protected builtWorkflow: WorkflowBase | null = null

  registry: WorkflowRegistry

  constructor({ credentialsMap, registry }: WorkflowFactoryProps) {
    this.credentialsMap = credentialsMap
    this.registry = registry
  }

  getCredentials(agentCredentialsKey: string) {
    const agentCreds = this.credentialsMap[agentCredentialsKey] as unknown as
      | AgentCredentials
      | undefined

    if (!agentCreds) {
      throw new Error(
        `Agent credentials not found for key: ${agentCredentialsKey}`,
      )
    }

    return agentCreds
  }

  /**
   * Build workflow and register nested flows in registry.
   * Must be implemented by subclasses.
   */
  abstract buildWorkflow(): Promise<void>

  /**
   * Get the built workflow after buildWorkflow() was called.
   */
  getBuiltWorkflow(): WorkflowBase | null {
    return this.builtWorkflow
  }

  /**
   * Override to register nested workflows before building.
   * Called by registry during first pass.
   */
  registerNestedFlows(): void {
    // Default: no nested flows to register upfront
  }

  /**
   * Override to get connections that reference other workflows.
   * Called after all workflows are built.
   */
  getExternalConnections(_registry: WorkflowRegistry): Record<string, unknown> {
    return {}
  }
}

import { AgentCredentials } from '../bootstrap/interfaces'
import { CredentialsMap, WorkflowBase } from '../workflows/interfaces'
import type { WorkflowRegistry } from '../WorkflowRegistry'
import { NodeType, WorkflowFactoryProps } from './interfaces'

export abstract class WorkflowFactory {
  credentialId: string | undefined

  credentialsMap: CredentialsMap

  protected builtWorkflow: WorkflowBase | null = null

  registry: WorkflowRegistry

  private _nodesStore: Record<string, NodeType> = {}

  protected nodes: Record<string, NodeType>

  constructor({ credentialsMap, registry }: WorkflowFactoryProps) {
    this.credentialsMap = credentialsMap
    this.registry = registry

    this.nodes = new Proxy(this._nodesStore, {
      get: (target, prop: string) => {
        if (prop === Symbol.iterator.toString() || typeof prop === 'symbol') {
          return Reflect.get(target, prop)
        }
        const node = target[prop]
        if (!node) {
          throw new Error(`Node "${prop}" not found`)
        }
        return node
      },
      set: (target, prop: string, value: NodeType) => {
        target[prop] = value
        return true
      },
    })
  }

  protected addNode(node: NodeType): void {
    this._nodesStore[node.name] = node
  }

  protected addNodes(nodes: NodeType[]): void {
    for (const node of nodes) {
      this.addNode(node)
    }
  }

  protected getNodesArray(): NodeType[] {
    return Object.values(this._nodesStore)
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

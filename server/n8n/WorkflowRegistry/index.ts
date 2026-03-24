import {
  CredentialsMap,
  WorkflowBase,
  WorkflowName,
} from '../workflows/interfaces'
import { WorkflowFactory } from '../WorkflowFactory'

export interface WorkflowWrapper {
  name: string
  workflow: WorkflowBase | null
  factory: WorkflowFactory | null
  built: boolean
}

export type WorkflowMap = Record<string, WorkflowWrapper | undefined>

export class WorkflowRegistry {
  private flows: WorkflowMap = {}

  private credentialsMap: CredentialsMap

  constructor(credentialsMap: CredentialsMap) {
    this.credentialsMap = credentialsMap
  }

  addFlow(
    name: WorkflowName | string,
    factoryOrWorkflow: WorkflowFactory | WorkflowBase,
  ): WorkflowWrapper {
    if (this.flows[name]) {
      return this.flows[name]
    }

    const isFactory = factoryOrWorkflow instanceof WorkflowFactory

    const wrapper: WorkflowWrapper = {
      name,
      workflow: isFactory ? null : (factoryOrWorkflow as WorkflowBase),
      factory: isFactory ? (factoryOrWorkflow as WorkflowFactory) : null,
      built: !isFactory,
    }

    this.flows[name] = wrapper
    return wrapper
  }

  get(name: WorkflowName): WorkflowWrapper | undefined {
    return this.flows[name]
  }

  has(name: WorkflowName): boolean {
    return name in this.flows
  }

  async build(
    name: WorkflowName | string,
  ): Promise<WorkflowWrapper | undefined> {
    const wrapper = this.flows[name]
    if (!wrapper) {
      return undefined
    }

    if (wrapper.built) {
      return wrapper
    }

    if (!wrapper.factory) {
      throw new Error(`Workflow "${name}" has no factory and is not built`)
    }

    // Build workflow and register nested flows
    await wrapper.factory.buildWorkflow()

    // Get the built workflow
    const workflow = wrapper.factory.getBuiltWorkflow()
    if (workflow) {
      wrapper.workflow = workflow
      wrapper.built = true
    }

    return wrapper
  }

  async buildAll(): Promise<void> {
    const names = Object.keys(this.flows)

    for (const name of names) {
      await this.build(name)
    }
  }

  getAll(): WorkflowMap {
    return this.flows
  }

  getAllBuilt(): WorkflowBase[] {
    const result: WorkflowBase[] = []
    for (const key of Object.keys(this.flows)) {
      const wrapper = this.flows[key]
      if (wrapper && wrapper.built && wrapper.workflow) {
        result.push(wrapper.workflow)
      }
    }
    return result
  }

  getCredentialsMap(): CredentialsMap {
    return this.credentialsMap
  }
}

import { WorkflowFactory } from 'server/n8n/WorkflowFactory'
import { createAgentWorldWorkflow } from './factory'
import { createToolAgentWorld } from '../tool-agent-world/factory'

export default class AgentWorldWorkflowFactory extends WorkflowFactory {
  async buildWorkflow(): Promise<void> {
    this.builtWorkflow = createAgentWorldWorkflow()

    // Register Tool: Agent World as a sub-workflow
    const toolAgentWorldWorkflow = createToolAgentWorld()
    this.registry.addFlow(toolAgentWorldWorkflow.name, toolAgentWorldWorkflow)
  }
}

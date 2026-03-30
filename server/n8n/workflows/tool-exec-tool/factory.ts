import { WorkflowBase } from '../interfaces'
import { getExecToolWorkflowName } from './helpers'
export { getExecToolWorkflowName }

export interface ExecToolConfig {
  agentName: string
}

export function createToolExecTool(config: ExecToolConfig): WorkflowBase {
  const { agentName } = config

  return {
    name: getExecToolWorkflowName(agentName),
    active: true,
    versionId: 'tool-exec-tool-v2',
    nodes: [
      {
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [240, 300],
        parameters: {
          inputSource: 'passthrough',
        },
      },
      {
        id: 'manual-trigger',
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [240, 500],
        parameters: {},
      },
      {
        id: 'set-test-input',
        name: 'Set Test Input',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [460, 500],
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'targetWorkflow',
                name: 'targetWorkflow',
                value: 'test-workflow-id',
                type: 'string',
              },
              {
                id: 'reasoning',
                name: 'reasoning',
                value: 'Test reasoning',
                type: 'string',
              },
            ],
          },
          options: {},
        },
      },
      // Log reasoning
      {
        id: 'log-reasoning',
        name: 'Log Reasoning',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [460, 300],
        parameters: {
          jsCode: `// Log the reasoning for this tool call
const input = $input.first().json

console.log('[ExecTool] Reasoning:', input.reasoning)
console.log('[ExecTool] Target workflow:', input.targetWorkflow)

// Pass through all data
return input`,
        },
      },
      // Execute target workflow dynamically
      {
        id: 'execute-target-workflow',
        name: 'Execute Target Workflow',
        type: 'n8n-nodes-base.executeWorkflow',
        typeVersion: 1.2,
        position: [680, 300],
        parameters: {
          source: 'database',
          workflowId: {
            __rl: true,
            mode: 'id',
            value: '={{ $json.targetWorkflow }}',
          },
          workflowInputs: {
            mappingMode: 'autoMapInputData',
          },
        },
      },
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Log Reasoning', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Log Reasoning', type: 'main', index: 0 }]],
      },
      'Log Reasoning': {
        main: [[{ node: 'Execute Target Workflow', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: 'narasim-dev-tool-exec-tool',
    },
  }
}

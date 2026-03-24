import { WorkflowBase } from '../interfaces'
import { getAgentWorldToolWorkflowName } from './helpers'

export function createToolAgentWorld(): WorkflowBase {
  return {
    name: getAgentWorldToolWorkflowName(),
    active: true,
    versionId: 'tool-agent-world-v1',
    nodes: [
      {
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [240, 300],
        parameters: {
          workflowInputs: {
            values: [
              { name: 'operation', type: 'string' },
              { name: 'maxDepth', type: 'number' },
              { name: 'expandNodeIds', type: 'string' },
              { name: 'parentNodeId', type: 'string' },
              { name: 'nodeType', type: 'string' },
              { name: 'nodeName', type: 'string' },
              { name: 'nodeData', type: 'string' },
              { name: 'nodeId', type: 'string' },
              { name: 'newParentId', type: 'string' },
              { name: 'expandDepth', type: 'number' },
            ],
          },
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
                id: 'operation',
                name: 'operation',
                value: 'read',
                type: 'string',
              },
              {
                id: 'maxDepth',
                name: 'maxDepth',
                value: '=10',
                type: 'number',
              },
            ],
          },
          options: {},
        },
      },
      {
        id: 'agent-world',
        name: 'Agent World',
        type: 'CUSTOM.agentWorld',
        typeVersion: 1,
        position: [680, 300],
        parameters: {
          operation: '={{ $json.operation }}',
          maxDepth: '={{ $json.maxDepth ?? 2 }}',
          expandNodeIds: '={{ $json.expandNodeIds ?? "" }}',
          formatAsContext: true,
          parentNodeId: '={{ $json.parentNodeId ?? "" }}',
          nodeId: '={{ $json.nodeId ?? "" }}',
          nodeType: '={{ $json.nodeType ?? "" }}',
          nodeName: '={{ $json.nodeName ?? "" }}',
          nodeData: '={{ JSON.stringify($json.nodeData ?? {}) }}',
          newParentId: '={{ $json.newParentId ?? "" }}',
          expandDepth: '={{ $json.expandDepth ?? 3 }}',
        },
      },
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Agent World', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Agent World', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: 'narasim-dev-tool-agent-world',
    },
  }
}

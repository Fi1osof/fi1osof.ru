import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { getAgentWorldWorkflowName } from './helpers'
import {
  getModel,
  createTool,
  createToolInputs,
  createStaticInputs,
} from '../helpers'
import { getAgentWorldToolWorkflowName } from '../tool-agent-world/helpers'

const systemMessage = fs.readFileSync(
  path.join(__dirname, 'systemMessage.md'),
  'utf-8',
)
const prepareContextCode = fs.readFileSync(
  path.join(__dirname, 'prepareContext.js'),
  'utf-8',
)

export function createAgentWorldWorkflow(): WorkflowBase {
  const model = getModel(
    process.env.AGENT_WORLD_MODEL || 'google/gemini-2.5-flash-lite',
  )

  const agentId = 'agent-world'

  return {
    name: getAgentWorldWorkflowName(),
    active: true,
    versionId: 'agent-world-v1',
    nodes: [
      // Chat Trigger
      {
        parameters: {
          public: true,
          mode: 'webhook',
          availableInChat: true,
          agentName: 'Agent World',
          agentDescription:
            'Manage agent world state. Add, read, update entities.',
          options: {},
        },
        id: 'chat-trigger',
        name: 'When chat message received',
        type: '@n8n/n8n-nodes-langchain.chatTrigger',
        typeVersion: 1.4,
        position: [240, 200],
        webhookId: `${agentId}-chat`,
      },
      // Execute Workflow Trigger
      {
        id: 'execute-workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [240, 400],
        parameters: {
          workflowInputs: {
            values: [
              { name: 'chatInput', type: 'string' },
              { name: 'sessionId', type: 'string' },
              { name: 'userId', type: 'string' },
            ],
          },
        },
      },
      // Merge Triggers
      {
        id: 'merge-triggers',
        name: 'Merge Triggers',
        type: 'n8n-nodes-base.merge',
        typeVersion: 3,
        position: [460, 300],
        parameters: {},
      },
      // Prepare Context
      {
        parameters: {
          jsCode: prepareContextCode,
        },
        id: 'prepare-context',
        name: 'Prepare Context',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [680, 300],
      },
      // Agent
      {
        id: 'world-agent',
        name: 'World Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        typeVersion: 3.1,
        position: [900, 300],
        parameters: {
          options: {
            systemMessage,
            maxIterations: 10,
          },
        },
      },
      // Chat Model
      {
        id: 'chat-model',
        name: 'Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        typeVersion: 1,
        position: [900, 520],
        credentials: {
          openRouterApi: {
            id: 'FsN0N48lU327xkz6',
            name: 'OpenRouter',
          },
        },
        parameters: {
          model,
          options: {},
        },
      },
      // Tool: Read World
      (() => {
        const staticInputs = createStaticInputs([
          { name: 'operation', value: 'read', type: 'string', required: true },
        ])
        const aiInputs = createToolInputs([
          {
            name: 'maxDepth',
            description: 'Maximum depth to read (default: 2)',
            type: 'number',
          },
          {
            name: 'expandNodeIds',
            description: 'Comma-separated node IDs to expand deeper',
            type: 'string',
          },
        ])
        return createTool({
          name: 'read_world',
          toolName: 'Read World Tool',
          description:
            'Read the current world state. Returns the world graph with nodes.',
          workflowName: getAgentWorldToolWorkflowName(),
          nodeId: `${agentId}-tool-read-world`,
          position: [1152, 544],
          inputs: {
            value: { ...staticInputs.value, ...aiInputs.value },
            schema: [...staticInputs.schema, ...aiInputs.schema],
          },
        })
      })(),
      // Tool: Add Node
      (() => {
        const staticInputs = createStaticInputs([
          {
            name: 'operation',
            value: 'addNode',
            type: 'string',
            required: true,
          },
        ])
        const aiInputs = createToolInputs([
          {
            name: 'parentNodeId',
            description: 'ID of parent node (use "root" to add to root)',
            type: 'string',
            required: true,
          },
          {
            name: 'nodeType',
            description: 'Type: user, task, article, etc.',
            type: 'string',
            required: true,
          },
          {
            name: 'nodeName',
            description: 'Display name',
            type: 'string',
            required: true,
          },
          {
            name: 'nodeData',
            description: 'Additional data for the node (JSON string)',
            type: 'string',
          },
        ])
        return createTool({
          name: 'add_node',
          toolName: 'Add Node Tool',
          description:
            'Add a new node to the world. Specify parent, type, name, and data. Use parentNodeId="root" to add to root.',
          workflowName: getAgentWorldToolWorkflowName(),
          nodeId: `${agentId}-tool-add-node`,
          position: [1344, 544],
          inputs: {
            value: { ...staticInputs.value, ...aiInputs.value },
            schema: [...staticInputs.schema, ...aiInputs.schema],
          },
        })
      })(),
      // Tool: Update Node
      (() => {
        const staticInputs = createStaticInputs([
          {
            name: 'operation',
            value: 'updateNode',
            type: 'string',
            required: true,
          },
        ])
        const aiInputs = createToolInputs([
          {
            name: 'nodeId',
            description: 'ID of the node to update',
            type: 'string',
            required: true,
          },
          {
            name: 'nodeName',
            description: 'New display name (optional)',
            type: 'string',
          },
          {
            name: 'nodeData',
            description: 'Data to merge into the node (JSON string)',
            type: 'string',
          },
        ])
        return createTool({
          name: 'update_node',
          toolName: 'Update Node Tool',
          description: 'Update an existing node in the world.',
          workflowName: getAgentWorldToolWorkflowName(),
          nodeId: `${agentId}-tool-update-node`,
          position: [1536, 544],
          inputs: {
            value: { ...staticInputs.value, ...aiInputs.value },
            schema: [...staticInputs.schema, ...aiInputs.schema],
          },
        })
      })(),
      // Tool: Delete Node
      (() => {
        const staticInputs = createStaticInputs([
          {
            name: 'operation',
            value: 'deleteNode',
            type: 'string',
            required: true,
          },
        ])
        const aiInputs = createToolInputs([
          {
            name: 'nodeId',
            description: 'ID of the node to delete',
            type: 'string',
            required: true,
          },
        ])
        return createTool({
          name: 'delete_node',
          toolName: 'Delete Node Tool',
          description: 'Delete a node from the world. Cannot delete root node.',
          workflowName: getAgentWorldToolWorkflowName(),
          nodeId: `${agentId}-tool-delete-node`,
          position: [1728, 544],
          inputs: {
            value: { ...staticInputs.value, ...aiInputs.value },
            schema: [...staticInputs.schema, ...aiInputs.schema],
          },
        })
      })(),
      // Tool: Move Node
      (() => {
        const staticInputs = createStaticInputs([
          {
            name: 'operation',
            value: 'moveNode',
            type: 'string',
            required: true,
          },
        ])
        const aiInputs = createToolInputs([
          {
            name: 'nodeId',
            description: 'ID of the node to move',
            type: 'string',
            required: true,
          },
          {
            name: 'newParentId',
            description: 'ID of the new parent node',
            type: 'string',
            required: true,
          },
        ])
        return createTool({
          name: 'move_node',
          toolName: 'Move Node Tool',
          description:
            'Move a node to a new parent. Cannot move root or create cycles.',
          workflowName: getAgentWorldToolWorkflowName(),
          nodeId: `${agentId}-tool-move-node`,
          position: [1920, 544],
          inputs: {
            value: { ...staticInputs.value, ...aiInputs.value },
            schema: [...staticInputs.schema, ...aiInputs.schema],
          },
        })
      })(),
    ],
    connections: {
      'When chat message received': {
        main: [[{ node: 'Merge Triggers', type: 'main', index: 0 }]],
      },
      'Execute Workflow Trigger': {
        main: [[{ node: 'Merge Triggers', type: 'main', index: 1 }]],
      },
      'Merge Triggers': {
        main: [[{ node: 'Prepare Context', type: 'main', index: 0 }]],
      },
      'Prepare Context': {
        main: [[{ node: 'World Agent', type: 'main', index: 0 }]],
      },
      'Chat Model': {
        ai_languageModel: [
          [{ node: 'World Agent', type: 'ai_languageModel', index: 0 }],
        ],
      },
      'Read World Tool': {
        ai_tool: [[{ node: 'World Agent', type: 'ai_tool', index: 0 }]],
      },
      'Add Node Tool': {
        ai_tool: [[{ node: 'World Agent', type: 'ai_tool', index: 0 }]],
      },
      'Update Node Tool': {
        ai_tool: [[{ node: 'World Agent', type: 'ai_tool', index: 0 }]],
      },
      'Delete Node Tool': {
        ai_tool: [[{ node: 'World Agent', type: 'ai_tool', index: 0 }]],
      },
      'Move Node Tool': {
        ai_tool: [[{ node: 'World Agent', type: 'ai_tool', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: 'narasim-dev-agent-world',
    },
  }
}

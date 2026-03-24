import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow'
import { worldsStore } from './WorldsStore'

export class AgentWorld implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Agent World',
    name: 'agentWorld',
    icon: 'fa:globe',
    iconColor: 'blue',
    group: ['transform'],
    version: 1,
    description: 'Manage agent world state with attention-based node reading',
    defaults: {
      name: 'Agent World',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Read',
            value: 'read',
            description: 'Read world state with depth control',
          },
          {
            name: 'Add Node',
            value: 'addNode',
            description: 'Add a node to the world',
          },
          {
            name: 'Update Node',
            value: 'updateNode',
            description: 'Update an existing node',
          },
          {
            name: 'Delete Node',
            value: 'deleteNode',
            description: 'Delete a node from the world',
          },
          {
            name: 'Move Node',
            value: 'moveNode',
            description: 'Move a node to a new parent',
          },
          {
            name: 'Expand Node',
            value: 'expandNode',
            description: 'Expand a specific node to see more depth',
          },
          {
            name: 'Stats',
            value: 'stats',
            description: 'Get statistics about stored worlds',
          },
          {
            name: 'Upsert User',
            value: 'upsertUser',
            description: 'Create or update user in the world',
          },
          {
            name: 'Add Conversation',
            value: 'addConversation',
            description: 'Add conversation with response to user history',
          },
        ],
        default: 'read',
      },
      {
        displayName: 'Max Depth',
        name: 'maxDepth',
        type: 'number',
        default: 2,
        description: 'Maximum depth to read nodes',
        displayOptions: {
          show: { operation: ['read'] },
        },
      },
      {
        displayName: 'Expand Node IDs',
        name: 'expandNodeIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of node IDs to expand deeper',
        displayOptions: {
          show: { operation: ['read'] },
        },
      },
      {
        displayName: 'Format as Context',
        name: 'formatAsContext',
        type: 'boolean',
        default: false,
        description: 'Format output as text suitable for LLM context',
        displayOptions: {
          show: { operation: ['read'] },
        },
      },
      {
        displayName: 'Parent Node ID',
        name: 'parentNodeId',
        type: 'string',
        default: '',
        description: 'ID of the parent node (use "root" to add to root)',
        displayOptions: {
          show: { operation: ['addNode'] },
        },
      },
      {
        displayName: 'Node ID',
        name: 'nodeId',
        type: 'string',
        default: '',
        description: 'ID of the node',
        displayOptions: {
          show: {
            operation: ['updateNode', 'deleteNode', 'moveNode', 'expandNode'],
          },
        },
      },
      {
        displayName: 'Node Type',
        name: 'nodeType',
        type: 'string',
        default: '',
        description: 'Type of node (task, user, article, etc.)',
        displayOptions: {
          show: { operation: ['addNode'] },
        },
      },
      {
        displayName: 'Node Name',
        name: 'nodeName',
        type: 'string',
        default: '',
        description: 'Display name for the node',
        displayOptions: {
          show: { operation: ['addNode', 'updateNode'] },
        },
      },
      {
        displayName: 'Node Data',
        name: 'nodeData',
        type: 'json',
        default: '{}',
        description: 'JSON data for the node',
        displayOptions: {
          show: { operation: ['addNode', 'updateNode'] },
        },
      },
      {
        displayName: 'New Parent ID',
        name: 'newParentId',
        type: 'string',
        default: '',
        description: 'ID of the new parent node',
        displayOptions: {
          show: { operation: ['moveNode'] },
        },
      },
      {
        displayName: 'Expand Depth',
        name: 'expandDepth',
        type: 'number',
        default: 3,
        description: 'Depth to expand the node',
        displayOptions: {
          show: { operation: ['expandNode'] },
        },
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        description: 'ID of the user (from auth system)',
        displayOptions: {
          show: { operation: ['upsertUser'] },
        },
      },
      {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        default: '',
        description: 'Session ID for anonymous or authenticated user',
        displayOptions: {
          show: { operation: ['upsertUser'] },
        },
      },
      {
        displayName: 'User Name',
        name: 'userName',
        type: 'string',
        default: '',
        description: 'Display name for the user',
        displayOptions: {
          show: { operation: ['upsertUser'] },
        },
      },
      {
        displayName: 'User Data',
        name: 'userData',
        type: 'json',
        default: '{}',
        description: 'Additional user data as JSON',
        displayOptions: {
          show: { operation: ['upsertUser'] },
        },
      },
      {
        displayName: 'User ID',
        name: 'convUserId',
        type: 'string',
        default: '',
        description: 'ID of the user (from auth system)',
        displayOptions: {
          show: { operation: ['addConversation'] },
        },
      },
      {
        displayName: 'Session ID',
        name: 'convSessionId',
        type: 'string',
        default: '',
        description: 'Session ID for anonymous or authenticated user',
        displayOptions: {
          show: { operation: ['addConversation'] },
        },
      },
      {
        displayName: 'Chat Input',
        name: 'chatInput',
        type: 'string',
        default: '',
        description: 'User message content',
        displayOptions: {
          show: { operation: ['addConversation'] },
        },
      },
      {
        displayName: 'Response',
        name: 'response',
        type: 'string',
        default: '',
        description: 'Agent response content',
        displayOptions: {
          show: { operation: ['addConversation'] },
        },
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const operation = this.getNodeParameter('operation', 0) as string

    const agentId = 'global'
    const ownerIdValue = undefined

    if (operation === 'read') {
      const maxDepth = this.getNodeParameter('maxDepth', 0, 2) as number
      const expandNodeIdsRaw = this.getNodeParameter(
        'expandNodeIds',
        0,
        '',
      ) as string

      const expandNodeIds = expandNodeIdsRaw
        ? expandNodeIdsRaw.split(',').map((s) => s.trim())
        : []

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const worldState = world.read({ maxDepth, expandNodeIds })

      return [
        [
          {
            json: {
              ...worldState,
            },
          },
        ],
      ]

      // const result: Record<string, unknown> = {
      //   world: worldState,
      //   agentId,
      //   ownerId: ownerIdValue || null,
      // }

      // return [
      //   items.map((item) => ({
      //     json: { ...item.json, ...result } as IDataObject,
      //   })),
      // ]
    }

    if (operation === 'addNode') {
      const parentNodeId = this.getNodeParameter(
        'parentNodeId',
        0,
        '',
      ) as string
      const nodeType = this.getNodeParameter('nodeType', 0, '') as string
      const nodeName = this.getNodeParameter('nodeName', 0, '') as string
      const nodeDataRaw = this.getNodeParameter('nodeData', 0, '{}') as string

      let nodeData: Record<string, unknown> = {}
      try {
        nodeData =
          typeof nodeDataRaw === 'string'
            ? JSON.parse(nodeDataRaw)
            : nodeDataRaw
      } catch {
        nodeData = {}
      }

      if (!parentNodeId) {
        throw new Error(
          'addNode failed: parentNodeId is required. Use "root" to add to root.',
        )
      }
      if (!nodeType) {
        throw new Error('addNode failed: nodeType is required.')
      }
      if (!nodeName) {
        throw new Error('addNode failed: nodeName is required.')
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const newNode = world.addNode(parentNodeId, {
        type: nodeType,
        name: nodeName,
        data: nodeData,
      })

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            added: true,
            node: newNode,
          } as IDataObject,
        })),
      ]
    }

    if (operation === 'updateNode') {
      const nodeId = this.getNodeParameter('nodeId', 0, '') as string
      const nodeName = this.getNodeParameter('nodeName', 0, '') as string
      const nodeDataRaw = this.getNodeParameter('nodeData', 0, '{}') as string

      let nodeData: Record<string, unknown> = {}
      try {
        nodeData =
          typeof nodeDataRaw === 'string'
            ? JSON.parse(nodeDataRaw)
            : nodeDataRaw
      } catch {
        nodeData = {}
      }

      if (!nodeId) {
        throw new Error('updateNode failed: nodeId is required.')
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const updatedNode = world.updateNode(nodeId, {
        name: nodeName || undefined,
        data: nodeData,
      })

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            updated: true,
            node: updatedNode,
          } as IDataObject,
        })),
      ]
    }

    if (operation === 'deleteNode') {
      const nodeId = this.getNodeParameter('nodeId', 0, '') as string

      if (!nodeId) {
        throw new Error('deleteNode failed: nodeId is required.')
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      world.deleteNode(nodeId)

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            deleted: true,
            nodeId,
          } as IDataObject,
        })),
      ]
    }

    if (operation === 'moveNode') {
      const nodeId = this.getNodeParameter('nodeId', 0, '') as string
      const newParentId = this.getNodeParameter('newParentId', 0, '') as string

      if (!nodeId) {
        throw new Error('moveNode failed: nodeId is required.')
      }
      if (!newParentId) {
        throw new Error('moveNode failed: newParentId is required.')
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const movedNode = world.moveNode(nodeId, newParentId)

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            moved: true,
            node: movedNode,
            newParentId,
          } as IDataObject,
        })),
      ]
    }

    if (operation === 'expandNode') {
      const nodeId = this.getNodeParameter('nodeId', 0, '') as string
      const expandDepth = this.getNodeParameter('expandDepth', 0, 3) as number

      if (!nodeId) {
        throw new Error('expandNode failed: nodeId is required.')
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const expandedNode = world.expandNode(nodeId, expandDepth)

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            expanded: true,
            node: expandedNode,
          } as IDataObject,
        })),
      ]
    }

    if (operation === 'stats') {
      const stats = worldsStore.getStats()
      return [
        items.map((item) => ({
          json: { ...item.json, ...stats } as IDataObject,
        })),
      ]
    }

    if (operation === 'upsertUser') {
      const userId = this.getNodeParameter('userId', 0, '') as string
      const sessionId = this.getNodeParameter('sessionId', 0, '') as string
      const userName = this.getNodeParameter('userName', 0, '') as string
      const userDataRaw = this.getNodeParameter('userData', 0, '{}') as string

      let userData: Record<string, unknown> = {}
      try {
        userData =
          typeof userDataRaw === 'string'
            ? JSON.parse(userDataRaw)
            : userDataRaw
      } catch {
        userData = {}
      }

      if (!userId && !sessionId) {
        throw new Error(
          'upsertUser failed: Either userId or sessionId must be provided.',
        )
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const userNode = world.upsertUser({
        userId: userId || undefined,
        sessionId: sessionId || undefined,
        name: userName || undefined,
        ...userData,
      })

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            upserted: true,
            user: userNode,
          } as IDataObject,
        })),
      ]
    }

    if (operation === 'addConversation') {
      const userId = this.getNodeParameter('convUserId', 0, '') as string
      const sessionId = this.getNodeParameter('convSessionId', 0, '') as string
      const chatInput = this.getNodeParameter('chatInput', 0, '') as string
      const response = this.getNodeParameter('response', 0, '') as string

      if (!userId && !sessionId) {
        throw new Error(
          'addConversation failed: Either userId or sessionId must be provided.',
        )
      }

      if (!chatInput) {
        throw new Error('addConversation failed: chatInput is required.')
      }

      const world = worldsStore.getOrCreate(agentId, ownerIdValue)
      const user = world.getUser(userId || undefined, sessionId || undefined)

      if (!user) {
        throw new Error(
          'addConversation failed: User not found. Use upsertUser first.',
        )
      }

      const conversation = world.addConversation(user, { content: chatInput })

      if (response) {
        world.addResponse(conversation, { content: response, type: 'text' })
      }

      return [
        items.map((item) => ({
          json: {
            ...item.json,
            added: true,
            conversation,
          } as IDataObject,
        })),
      ]
    }

    return [items]
  }
}

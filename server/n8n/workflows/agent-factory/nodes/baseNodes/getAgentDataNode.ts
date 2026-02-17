import { print } from 'graphql'
import { MeDocument } from 'src/gql/generated/me'
import { NodeType } from '../../interfaces'
import { getGraphqlRequestWorkflowName } from '../../../tool-graphql-request/helpers'

const meUserQuery = print(MeDocument)

export interface GetAgentDataNodeConfig {
  nodeId: string
  agentName: string
  position: [number, number]
}

export function getAgentDataNode(config: GetAgentDataNodeConfig): NodeType {
  const { nodeId, agentName, position } = config

  return {
    id: nodeId,
    name: 'Get Agent Data',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.2,
    position,
    parameters: {
      workflowId: {
        __rl: true,
        mode: 'list',
        value: getGraphqlRequestWorkflowName(agentName),
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: meUserQuery,
        },
        matchingColumns: [],
        schema: [
          {
            id: 'query',
            displayName: 'query',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
  }
}

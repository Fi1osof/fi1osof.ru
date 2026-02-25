import { print } from 'graphql'
import { MyMindLogsDocument } from 'src/gql/generated/myMindLogs'
import { MindLogType } from 'src/gql/generated/types'
import { NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

const myMindLogsQuery = print(MyMindLogsDocument)

const FETCH_MINDLOG_TYPES: MindLogType[] = [
  MindLogType.KNOWLEDGE,
  MindLogType.IDENTITY,
  MindLogType.CONTEXT,
]

const FETCH_MINDLOGS_TAKE = 100

type GetFetchMindLogsNodeProps = {
  agentId: string
  agentName: string
}

export function getFetchMindLogsNode({
  agentId,
  agentName,
}: GetFetchMindLogsNodeProps): NodeType {
  const typesArray = JSON.stringify(FETCH_MINDLOG_TYPES)

  const variables = `={{ (() => {
    const types = ${typesArray};
    const where = { type: { in: types } };
    return JSON.stringify({ where: where, take: ${FETCH_MINDLOGS_TAKE} });
  })() }}`

  return {
    parameters: {
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: myMindLogsQuery,
          variables,
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
          {
            id: 'variables',
            displayName: 'variables',
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
    id: `${agentId}-fetch-mindlogs`,
    name: 'Fetch MindLogs',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.2,
    position: getNodeCoordinates('fetch-mindlogs'),
  }
}

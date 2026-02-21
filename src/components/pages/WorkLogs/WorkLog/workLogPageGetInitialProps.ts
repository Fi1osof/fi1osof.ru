import { Page } from '../../_App/interfaces'
import { WorkLogPageProps } from './interfaces'
import {
  TaskWorkLogDocument,
  TaskWorkLogQuery,
  TaskWorkLogQueryVariables,
} from 'src/gql/generated'
import { getWorkLogQueryVariables } from '../helpers'

export const workLogPageGetInitialProps: Page<WorkLogPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const workLogId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const variables = getWorkLogQueryVariables(workLogId)

    const workLog = workLogId
      ? await apolloClient.query<TaskWorkLogQuery, TaskWorkLogQueryVariables>({
          query: TaskWorkLogDocument,
          variables,
        })
      : undefined

    return {
      workLogId,
      statusCode: !workLog?.data?.response ? 404 : undefined,
    }
  }

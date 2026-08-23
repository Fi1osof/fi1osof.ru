import { WorkLogPageProps } from './interfaces'
import {
  TaskWorkLogDocument,
  TaskWorkLogQuery,
  TaskWorkLogQueryVariables,
} from 'src/gql/generated'
import { getWorkLogQueryVariables } from '../helpers'
import { Page } from 'src/components/pages/_App/interfaces'

export const workLogPageGetInitialProps: Page<WorkLogPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const workLogId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const variables = getWorkLogQueryVariables(workLogId)

    const workLog = workLogId
      ? await apolloClient
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          .query<TaskWorkLogQuery, TaskWorkLogQueryVariables>({
            query: TaskWorkLogDocument,
            variables,
          })
          .then((r) => r.data?.response)
      : undefined

    return {
      workLogId,
      statusCode: !workLog ? 404 : undefined,
    }
  }

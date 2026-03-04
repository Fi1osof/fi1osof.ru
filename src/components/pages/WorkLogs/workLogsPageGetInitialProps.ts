import { Page } from '../_App/interfaces'
import { WorkLogsPageProps } from './interfaces'
import {
  TaskWorkLogsWithCountDocument,
  TaskWorkLogsWithCountQuery,
  TaskWorkLogsWithCountQueryVariables,
} from 'src/gql/generated'
import { getWorkLogsWithCountQueryVariables } from './helpers'

const PAGE_SIZE = 20

export const workLogsPageGetInitialProps: Page<WorkLogsPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const variables = getWorkLogsWithCountQueryVariables(page, PAGE_SIZE)

    await apolloClient.query<
      TaskWorkLogsWithCountQuery,
      TaskWorkLogsWithCountQueryVariables
    >({
      query: TaskWorkLogsWithCountDocument,
      variables,
    })

    return {
      page,
    }
  }

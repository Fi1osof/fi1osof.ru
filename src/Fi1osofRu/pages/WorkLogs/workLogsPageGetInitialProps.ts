import { WorkLogsPageProps } from './interfaces'
import { TaskWorkLogsWithCountDocument } from 'src/gql/generated'
import { getWorkLogsWithCountQueryVariables } from './helpers'
import { Page } from 'src/components/pages/_App/interfaces'

const PAGE_SIZE = 20

export const workLogsPageGetInitialProps: Page<WorkLogsPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const variables = getWorkLogsWithCountQueryVariables(page, PAGE_SIZE)

    await apolloClient.query({
      query: TaskWorkLogsWithCountDocument,
      variables,
    })

    return {
      page,
    }
  }

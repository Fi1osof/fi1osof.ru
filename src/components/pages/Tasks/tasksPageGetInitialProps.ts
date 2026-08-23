import { Page } from '../_App/interfaces'
import { TasksPageProps } from './interfaces'
import {
  TasksWithCountDocument,
  TaskStatusEnum,
  TasksWithCountQuery,
  TasksWithCountQueryVariables,
} from 'src/gql/generated'
import { getTasksWithCountQueryVariables } from './helpers'

const PAGE_SIZE = 20

export const tasksPageGetInitialProps: Page<TasksPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const queryStatus = query.status
    const selectedStatus =
      queryStatus && typeof queryStatus === 'string'
        ? (queryStatus as TaskStatusEnum)
        : null

    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const variables = getTasksWithCountQueryVariables(
      selectedStatus,
      page,
      PAGE_SIZE,
    )

    const tasks = await apolloClient
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      .query<TasksWithCountQuery, TasksWithCountQueryVariables>({
        query: TasksWithCountDocument,
        variables,
      })
      .then((r) => r.data?.tasks)

    return {
      selectedStatus,
      page,
      statusCode: !tasks?.length && page > 1 ? 404 : undefined,
    }
  }

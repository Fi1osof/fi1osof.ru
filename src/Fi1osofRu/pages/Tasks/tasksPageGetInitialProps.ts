import { TasksPageProps } from './interfaces'
import {
  TasksWithCountDocument,
  TaskStatusEnum,
  TasksWithCountQuery,
  TasksWithCountQueryVariables,
} from 'src/gql/generated'
import { getTasksWithCountQueryVariables } from './helpers'
import { Page } from 'src/components/pages/_App/interfaces'

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

    const projectId =
      (typeof query.projectId === 'string' && query.projectId) || undefined

    const variables = getTasksWithCountQueryVariables(
      selectedStatus,
      page,
      PAGE_SIZE,
      projectId,
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
      projectId,
      statusCode: !tasks?.length && page > 1 ? 404 : undefined,
    }
  }

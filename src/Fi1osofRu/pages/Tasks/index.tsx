import { useTasksWithCountQuery } from 'src/gql/generated'
import { TasksPageProps } from './interfaces'
import { Page } from 'src/components/pages/_App/interfaces'
import { TasksView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getTasksWithCountQueryVariables } from './helpers'
import { tasksPageGetInitialProps } from './tasksPageGetInitialProps'

const PAGE_SIZE = 20

export const TasksPageFi1osofRu: Page<TasksPageProps> = ({
  selectedStatus,
  page,
  projectId,
  siteOrigin,
}) => {
  const variables = getTasksWithCountQueryVariables(
    selectedStatus,
    page,
    PAGE_SIZE,
    projectId,
  )

  const response = useTasksWithCountQuery({
    variables,
    pollInterval: 60000,
    fetchPolicy: 'cache-and-network',
  })

  const tasks = response.data?.tasks || []
  const totalCount = response.data?.tasksCount || 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <>
      <SeoHeaders title="Задачи" canonical={'/tasks'} siteOrigin={siteOrigin} />
      <TasksView
        tasks={tasks}
        loading={response.loading}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  )
}

TasksPageFi1osofRu.getInitialProps = tasksPageGetInitialProps

import { useTaskQuery } from 'src/gql/generated'
import { TaskPageProps } from './interfaces'
import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getTaskQueryVariables } from '../helpers'
import { taskPageGetInitialProps } from './taskPageGetInitialProps'
import { TaskPageView } from './View'
import { createTaskLink } from 'src/components/Link/Task'

export const TaskPageFi1osofRu: Page<TaskPageProps> = ({
  taskId,
  siteOrigin,
}) => {
  const variables = getTaskQueryVariables(taskId)

  const response = useTaskQuery({
    variables,
    skip: !taskId,
  })

  const task = response.data?.response

  const searchable = !!task

  return (
    <>
      <SeoHeaders
        title={task?.title || 'Task'}
        noindex={!searchable}
        nofollow={!searchable}
        siteOrigin={siteOrigin}
        canonical={task && createTaskLink(task)}
      />
      {task && <TaskPageView task={task} />}
    </>
  )
}

TaskPageFi1osofRu.getInitialProps = taskPageGetInitialProps

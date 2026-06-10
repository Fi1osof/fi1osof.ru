import { useTaskQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { TaskPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getTaskQueryVariables } from '../helpers'
import { taskPageGetInitialProps } from './taskPageGetInitialProps'
import { TaskPageView } from './View'

export const TaskPage: Page<TaskPageProps> = ({ taskId }) => {
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
      />
      {task && <TaskPageView task={task} />}
    </>
  )
}

TaskPage.getInitialProps = taskPageGetInitialProps

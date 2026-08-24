import { useTaskQuery } from 'src/gql/generated'
import { TaskPageProps } from './interfaces'
import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { taskLexicon } from './lexicon'
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
  const { t } = useLexicon(taskLexicon)

  const task = response.data?.response

  const searchable = !!task

  if (!task) {
    return null
  }

  return (
    <>
      <SeoHeaders
        title={task?.title}
        description={task?.description || t('seo.description')}
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

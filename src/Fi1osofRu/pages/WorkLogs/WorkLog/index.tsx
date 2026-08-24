import { useTaskWorkLogQuery } from 'src/gql/generated'
import { WorkLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { workLogLexicon } from './lexicon'
import { WorkLogPageStyled } from './styles'
import { getWorkLogQueryVariables } from '../helpers'
import { workLogPageGetInitialProps } from './workLogPageGetInitialProps'
import { WorkLogCard } from 'src/components/WorkLogCard'
import { TaskCard } from 'src/components/TaskCard'
import { H1Styled } from 'src/Fi1osofRu/styles'
import { Page } from 'src/components/pages/_App/interfaces'
import { createWorkLogLink } from 'src/components/Link/WorkLog'

export const WorkLogPageFi1osofRu: Page<WorkLogPageProps> = ({
  workLogId,
  siteOrigin,
}) => {
  const variables = getWorkLogQueryVariables(workLogId)

  const response = useTaskWorkLogQuery({
    variables,
    skip: !workLogId,
  })
  const { t } = useLexicon(workLogLexicon)

  const workLog = response.data?.response

  let title: string

  const { Task } = workLog || {}

  if (Task) {
    title = t('titleWithTask', { taskTitle: Task.title })
  } else {
    title = t('title')
  }

  const searchable = !!workLog

  const description = Task?.title
    ? t('seo.descriptionWithTask', { taskTitle: Task.title })
    : t('seo.description')

  return (
    <>
      <SeoHeaders
        title={title}
        description={description}
        noindex={!searchable}
        nofollow={!searchable}
        canonical={workLog ? createWorkLogLink(workLog) : undefined}
        siteOrigin={siteOrigin}
      />
      {workLog && (
        <WorkLogPageStyled size="wide">
          <H1Styled>{title}</H1Styled>

          <WorkLogCard workLog={workLog} variant="full" />

          {Task && (
            <>
              <TaskCard
                task={Task}
                variant="list"
                titlePrefix={t('taskPrefix')}
              />
            </>
          )}
        </WorkLogPageStyled>
      )}
    </>
  )
}

WorkLogPageFi1osofRu.getInitialProps = workLogPageGetInitialProps

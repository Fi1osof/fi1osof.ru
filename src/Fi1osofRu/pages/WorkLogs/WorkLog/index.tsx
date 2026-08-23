import { useTaskWorkLogQuery } from 'src/gql/generated'
import { WorkLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
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

  const workLog = response.data?.response

  let title: string

  const { Task } = workLog || {}

  if (Task) {
    title = `Ворклог по задаче "${Task.title}"`
  } else {
    title = 'Ворклог'
  }

  const searchable = !!workLog

  return (
    <>
      <SeoHeaders
        title={title}
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
              <TaskCard task={Task} variant="list" titlePrefix="Задача: " />
            </>
          )}
        </WorkLogPageStyled>
      )}
    </>
  )
}

WorkLogPageFi1osofRu.getInitialProps = workLogPageGetInitialProps

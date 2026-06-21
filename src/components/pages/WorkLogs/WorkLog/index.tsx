import { useTaskWorkLogQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { WorkLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { WorkLogPageStyled } from './styles'
import { getWorkLogQueryVariables } from '../helpers'
import { workLogPageGetInitialProps } from './workLogPageGetInitialProps'
import { WorkLogCard } from 'src/components/WorkLogCard'
import { TaskCard } from 'src/components/TaskCard'
import { H1Styled } from 'src/Fi1osofRu/styles'

export const WorkLogPage: Page<WorkLogPageProps> = ({ workLogId }) => {
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
      <SeoHeaders title={title} noindex={!searchable} nofollow={!searchable} />
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

WorkLogPage.getInitialProps = workLogPageGetInitialProps

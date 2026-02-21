import { useTaskWorkLogQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { WorkLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { WorkLogPageStyled } from './styles'
import { getWorkLogQueryVariables } from '../helpers'
import { workLogPageGetInitialProps } from './workLogPageGetInitialProps'
import { WorkLogCard } from 'src/components/WorkLogCard'

export const WorkLogPage: Page<WorkLogPageProps> = ({ workLogId }) => {
  const variables = getWorkLogQueryVariables(workLogId)

  const response = useTaskWorkLogQuery({
    variables,
    skip: !workLogId,
  })

  const workLog = response.data?.response

  return (
    <>
      <SeoHeaders title="Work Log" />
      {workLog && (
        <WorkLogPageStyled>
          <WorkLogCard workLog={workLog} variant="full" />
        </WorkLogPageStyled>
      )}
    </>
  )
}

WorkLogPage.getInitialProps = workLogPageGetInitialProps

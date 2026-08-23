import { useTaskWorkLogQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { WorkLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { WorkLogPageStyled } from './styles'
import { getWorkLogQueryVariables } from '../helpers'
import { workLogPageGetInitialProps } from './workLogPageGetInitialProps'
import { WorkLogCard } from 'src/components/WorkLogCard'
import { createWorkLogLink } from 'src/components/Link/WorkLog'

export const WorkLogPage: Page<WorkLogPageProps> = ({
  workLogId,
  siteOrigin,
}) => {
  const variables = getWorkLogQueryVariables(workLogId)

  const response = useTaskWorkLogQuery({
    variables,
    skip: !workLogId,
  })

  const workLog = response.data?.response

  return (
    <>
      <SeoHeaders
        title="Work Log"
        siteOrigin={siteOrigin}
        canonical={workLog && createWorkLogLink(workLog)}
      />
      {workLog && (
        <WorkLogPageStyled>
          <WorkLogCard workLog={workLog} variant="full" />
        </WorkLogPageStyled>
      )}
    </>
  )
}

WorkLogPage.getInitialProps = workLogPageGetInitialProps

import { useTaskWorkLogsWithCountQuery } from 'src/gql/generated'
import { Page } from '../_App/interfaces'
import { WorkLogsView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getWorkLogsWithCountQueryVariables } from './helpers'
import { workLogsPageGetInitialProps } from './workLogsPageGetInitialProps'
import { WorkLogsPageProps } from './interfaces'

const PAGE_SIZE = 20

export const WorkLogsPage: Page<WorkLogsPageProps> = ({ page }) => {
  const variables = getWorkLogsWithCountQueryVariables(page, PAGE_SIZE)

  const response = useTaskWorkLogsWithCountQuery({
    variables,
    fetchPolicy: 'cache-and-network',
  })

  const workLogs = response.data?.taskWorkLogs || []
  const totalCount = response.data?.taskWorkLogCount || 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <>
      <SeoHeaders title="Work Logs" />
      <WorkLogsView
        workLogs={workLogs}
        loading={response.loading}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  )
}

WorkLogsPage.getInitialProps = workLogsPageGetInitialProps

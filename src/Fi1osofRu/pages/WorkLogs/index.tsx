import { useTaskWorkLogsWithCountQuery } from 'src/gql/generated'
import { WorkLogsView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getWorkLogsWithCountQueryVariables } from './helpers'
import { workLogsPageGetInitialProps } from './workLogsPageGetInitialProps'
import { WorkLogsPageProps } from './interfaces'
import { Page } from 'src/components/pages/_App/interfaces'

const PAGE_SIZE = 20

export const WorkLogsPageFi1osofRu: Page<WorkLogsPageProps> = ({
  page,
  siteOrigin,
}) => {
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
      <SeoHeaders
        title="Ворклоги"
        canonical={'/worklogs'}
        siteOrigin={siteOrigin}
      />
      <WorkLogsView
        workLogs={workLogs}
        loading={response.loading}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  )
}

WorkLogsPageFi1osofRu.getInitialProps = workLogsPageGetInitialProps

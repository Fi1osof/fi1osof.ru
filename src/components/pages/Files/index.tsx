import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../_App/interfaces'
import { useFilesConnectionQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { FilesPageProps } from './interfaces'
import { getFilesConnectionQueryVariables } from './helpers'
import { FilesView } from './View'

export const FilesPage: Page<FilesPageProps> = ({ page = 1 }) => {
  const { user: currentUser } = useAppContext()

  const limit = 12

  const variables = getFilesConnectionQueryVariables({
    page: page,
    take: limit,
  })

  const response = useFilesConnectionQuery({
    skip: !currentUser?.sudo,
    variables,
  })

  return (
    <>
      <SeoHeaders
        title="Files"
        nofollow
        noindex
        canonical={undefined}
        siteOrigin={undefined}
      />

      <FilesView
        files={response.data?.files ?? []}
        count={response.data?.filesCount ?? 0}
        page={page}
        limit={variables.take ?? limit}
      />
    </>
  )
}

FilesPage.getInitialProps = async ({ query }) => {
  const pageParam = query.page
  const page =
    typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
      ? parseInt(pageParam, 10)
      : 1

  return {
    page,
  }
}

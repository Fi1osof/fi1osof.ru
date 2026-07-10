import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../_App/interfaces'
import { useConceptsConnectionQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { ConceptsPageProps } from './interfaces'
import { getConceptsConnectionQueryVariables } from './helpers'
import { ConceptsView } from './View'

export const ConceptsPage: Page<ConceptsPageProps> = ({ page = 1 }) => {
  const { user: currentUser } = useAppContext()

  const limit = 12

  const variables = getConceptsConnectionQueryVariables({
    page: page,
    take: limit,
  })

  const response = useConceptsConnectionQuery({
    skip: !currentUser?.sudo,
    variables,
  })

  return (
    <>
      <SeoHeaders
        title="Concepts"
        nofollow
        noindex
        canonical={undefined}
        siteOrigin={undefined}
      />

      <ConceptsView
        concepts={response.data?.concepts ?? []}
        count={response.data?.kBConceptsCount ?? 0}
        page={page}
        limit={variables.take ?? limit}
      />
    </>
  )
}

ConceptsPage.getInitialProps = async ({ query }) => {
  const pageParam = query.page
  const page =
    typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
      ? parseInt(pageParam, 10)
      : 1

  return {
    page,
  }
}

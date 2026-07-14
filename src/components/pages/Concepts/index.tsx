import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../_App/interfaces'
import { useConceptsConnectionQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { ConceptsPageProps } from './interfaces'
import { getConceptsConnectionQueryVariables } from './helpers'
import { ConceptsView } from './View'
import Link from 'next/link'

export const ConceptsPage: Page<ConceptsPageProps> = ({
  page = 1,
  siteOrigin,
}) => {
  const { user: currentUser } = useAppContext()

  const limit = 12

  const variables = getConceptsConnectionQueryVariables({
    page: page,
    take: limit,
    currentUser,
  })

  const response = useConceptsConnectionQuery({
    variables,
  })

  return (
    <>
      <SeoHeaders
        title="Concepts"
        canonical={`/concepts${page > 1 ? `` : `?page=${page}`}`}
        siteOrigin={siteOrigin}
      />

      {currentUser?.sudo && (
        <div>
          <Link href="/concepts/create" rel="nofollow">
            Create
          </Link>
        </div>
      )}

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

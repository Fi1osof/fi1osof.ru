import { Page, PageProps } from 'src/components/pages/_App/interfaces'
import { preloadConcept } from 'src/components/pages/Concepts/Concept/getInitialProps'
import {
  SiteRouteDocument,
  SiteRouteQuery,
  SiteRouteQueryVariables,
} from 'src/gql/generated'
import { ConceptPage } from 'src/components/pages/Concepts/Concept'

type SiteRouterPageProps = PageProps & {
  conceptId?: string
}

export const SiteRouterPage: Page<SiteRouterPageProps> = ({ conceptId }) => {
  if (conceptId) {
    return <ConceptPage conceptId={conceptId} />
  }

  return null
}

SiteRouterPage.getInitialProps = async ({ asPath, apolloClient }) => {
  const siteRoute = await apolloClient
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    .query<SiteRouteQuery, SiteRouteQueryVariables>({
      query: SiteRouteDocument,
      variables: {
        where: {
          path: asPath,
        },
      },
    })
    .then((r) => r.data?.siteRoute)

  if (siteRoute?.kBConceptId) {
    return preloadConcept({
      conceptId: siteRoute.kBConceptId,
      apolloClient,
    })
  }

  return {
    statusCode: 404,
  }
}

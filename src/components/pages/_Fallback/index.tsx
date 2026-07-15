import { Page, PageProps } from 'src/components/pages/_App/interfaces'
import { preloadConcept } from 'src/components/pages/Concepts/Concept/getInitialProps'

import { ConceptPage } from 'src/components/pages/Concepts/Concept'

type SiteRouterPageProps = PageProps & {
  uri: string | undefined
}

export const SiteRouterPage: Page<SiteRouterPageProps> = (props) => {
  return <ConceptPage {...props} />
}

SiteRouterPage.getInitialProps = async ({ asPath, apolloClient }) => {
  const uri = asPath?.split('?')[0]

  return await preloadConcept({
    uri,
    apolloClient,
  })
}

import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'
import { KbConceptVisibility, useConceptQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { ConceptView } from './View'
import { conceptPageGetInitialProps } from './getInitialProps'
import { ConceptPageProps } from './interfaces'

export const ConceptPage: Page<ConceptPageProps> = ({ siteOrigin, uri }) => {
  const { user: currentUser } = useAppContext()

  const response = useConceptQuery({
    variables: {
      where: {
        uri,
      },
    },
    skip: !uri,
  })

  const concept = response.data?.concept

  const searchable =
    concept && concept.visibility !== KbConceptVisibility.UNPUBLISHED
      ? true
      : false

  return (
    <>
      <SeoHeaders
        title={concept?.name ?? 'Concept'}
        description={concept?.description}
        canonical={concept?.uri}
        siteOrigin={siteOrigin}
        nofollow={!searchable}
        noindex={!searchable}
      />

      {concept && <ConceptView concept={concept} currentUser={currentUser} />}
    </>
  )
}

ConceptPage.getInitialProps = conceptPageGetInitialProps

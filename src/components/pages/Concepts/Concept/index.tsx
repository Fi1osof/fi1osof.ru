import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'
import { useConceptQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { ConceptView } from './View'
import { conceptPageGetInitialProps } from './getInitialProps'
import { ConceptPageProps } from './interfaces'

export const ConceptPage: Page<ConceptPageProps> = ({
  siteOrigin,
  conceptId,
}) => {
  const { user: currentUser } = useAppContext()

  const response = useConceptQuery({
    variables: {
      where: {
        id: conceptId,
      },
    },
    skip: !conceptId,
  })

  const concept = response.data?.concept

  const searchable = !concept

  return (
    <>
      <SeoHeaders
        title={concept?.name ?? 'Concept'}
        nofollow={!searchable}
        noindex={!searchable}
        canonical={concept?.uri}
        siteOrigin={siteOrigin}
      />

      {concept && <ConceptView concept={concept} currentUser={currentUser} />}
    </>
  )
}

ConceptPage.getInitialProps = conceptPageGetInitialProps

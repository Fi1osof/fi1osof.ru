import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'
import { useConceptQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { useParams } from 'next/navigation'
import { ConceptView } from './View'

export const ConceptPage: Page = () => {
  const params = useParams()

  const id = typeof params.id === 'string' ? params.id : undefined

  const { user: currentUser } = useAppContext()

  const response = useConceptQuery({
    skip: !currentUser?.sudo,
    variables: {
      where: {
        id,
      },
    },
  })

  const concept = response.data?.concept

  return (
    <>
      <SeoHeaders title={concept?.name ?? 'Concept'} nofollow noindex />

      {concept && <ConceptView concept={concept} currentUser={currentUser} />}
    </>
  )
}

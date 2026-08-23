import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { ConceptEditForm } from '../Form'
import { useAppContext } from 'src/components/AppContext'

export const ConceptCreatePage: React.FC = () => {
  const { user: currentUser } = useAppContext()

  return (
    <>
      <SeoHeaders
        title="Create concept"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />

      {currentUser && (
        <ConceptEditForm
          cancelHandler={undefined}
          concept={undefined}
          currentUser={currentUser}
        />
      )}
    </>
  )
}

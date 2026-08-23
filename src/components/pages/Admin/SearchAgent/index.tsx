import { useAppContext } from 'src/components/AppContext'
import { Page } from '../../_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { SearchAgentPageView } from './View'

export const SearchAgentPage: Page = () => {
  const { user } = useAppContext()

  return (
    <>
      <SeoHeaders
        title="Search agent"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />

      {user?.sudo && <SearchAgentPageView />}
    </>
  )
}

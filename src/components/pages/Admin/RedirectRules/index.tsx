import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'
import { useAppContext } from 'src/components/AppContext'
import { AdminRedirectRulesPageView } from './View'

export const AdminRedirectRulesPage: Page = () => {
  const { user } = useAppContext()

  return (
    <>
      <SeoHeaders
        title="Admin Redirect rules"
        canonical={undefined}
        siteOrigin={undefined}
        noindex
        nofollow
      />

      {user?.sudo && <AdminRedirectRulesPageView />}
    </>
  )
}

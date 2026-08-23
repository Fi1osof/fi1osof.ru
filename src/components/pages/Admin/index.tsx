import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../_App/interfaces'
import { useAppContext } from 'src/components/AppContext'
import { AdminPageView } from './View'

export const AdminPage: Page = () => {
  const { user } = useAppContext()

  return (
    <>
      <SeoHeaders
        title="Admin"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />

      {user?.sudo && <AdminPageView />}
    </>
  )
}

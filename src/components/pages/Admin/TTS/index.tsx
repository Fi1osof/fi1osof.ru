import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'
import { useAppContext } from 'src/components/AppContext'
import { AdminTtsPageView } from './View'

export const AdminTtsPage: Page = () => {
  const { user } = useAppContext()

  return (
    <>
      <SeoHeaders
        title="Admin. TTS"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />

      {user?.sudo && <AdminTtsPageView />}
    </>
  )
}

import { useAppContext } from 'src/components/AppContext'
import { ImageGenerator } from 'src/components/ImageGenerator'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'

export default function () {
  const { user } = useAppContext()

  return (
    <>
      <SeoHeaders
        title="Image uploader"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />
      {user?.sudo && <ImageGenerator />}
    </>
  )
}

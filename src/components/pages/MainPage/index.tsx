import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { JsonLd } from 'src/components/seo/JsonLd'
import { Page } from '../_App/interfaces'
import { createWebSite } from 'src/components/seo/JsonLd/helpers'

export const MainPage: Page = (props) => {
  const siteTitle = ''
  const siteUrl = props.siteOrigin

  return (
    <>
      {siteTitle && (
        <SeoHeaders
          title={siteTitle}
          canonical={'/'}
          siteOrigin={props.siteOrigin}
        />
      )}
      {siteUrl && (
        <JsonLd
          data={createWebSite({
            name: siteTitle || '',
            url: siteUrl,
          })}
        />
      )}
    </>
  )
}

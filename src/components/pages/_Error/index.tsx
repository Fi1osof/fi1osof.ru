import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import NextError from 'next/error'

export class ErrorPage extends NextError {
  render() {
    return (
      <div>
        <SeoHeaders
          noindex
          nofollow
          title="Server error"
          description=""
          canonical={undefined}
          siteOrigin={undefined}
        />

        <h2>Server error</h2>
      </div>
    )
  }
}

import Head from 'next/head'

export interface SeoHeadersProps {
  title: string
  description?: string | null
  noindex?: boolean
  nofollow?: boolean
  canonical: string | null | undefined
  siteOrigin: string | undefined
}

export const SeoHeaders: React.FC<SeoHeadersProps> = ({
  title,
  description,
  noindex = false,
  nofollow = false,
  canonical,
  siteOrigin,
}) => {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && (
        <link
          rel="canonical"
          href={siteOrigin ? `${siteOrigin}${canonical}` : canonical}
        />
      )}

      <meta
        name="robots"
        content={[
          noindex ? 'noindex' : 'index',
          nofollow ? 'nofollow' : 'follow',
        ].join(', ')}
      />
    </Head>
  )
}

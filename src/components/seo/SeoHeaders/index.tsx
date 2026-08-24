import Head from 'next/head'
import { useAppContext } from 'src/components/AppContext'
import { LOCALE_CODES } from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'
import { getLocalePrefix } from 'src/Fi1osofRu/Lexicon/helpers/getLocalePrefix'

export interface SeoHeadersProps {
  title: string
  description?: string | null
  noindex?: boolean
  nofollow?: boolean
  canonical: string | null | undefined
  siteOrigin: string | undefined
  keywords?: string | undefined
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authorUrl?: string | null
}

export const SeoHeaders: React.FC<SeoHeadersProps> = ({
  title,
  description,
  noindex = false,
  nofollow = false,
  canonical,
  siteOrigin,
  keywords,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authorUrl,
}) => {
  const { locale } = useAppContext()

  const isInternational = true
  const localePrefix = getLocalePrefix(locale)

  let href = siteOrigin
    ? `${siteOrigin}${isInternational ? localePrefix : ''}`
    : ''

  if (href) {
    href += canonical === '/' ? '' : canonical
  }

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {href && <link rel="canonical" href={href} />}

      {isInternational &&
        canonical &&
        siteOrigin &&
        LOCALE_CODES.map((code) => (
          <link
            key={code}
            rel="alternate"
            hrefLang={code}
            href={`${siteOrigin}${getLocalePrefix(code)}${canonical}`}
          />
        ))}

      {isInternational && canonical && siteOrigin && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${siteOrigin}${canonical === '/' ? '' : canonical}`}
        />
      )}

      <meta
        name="robots"
        content={[
          noindex ? 'noindex' : 'index',
          nofollow ? 'nofollow' : 'follow',
        ].join(', ')}
      />

      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      {description && <meta property="og:description" content={description} />}
      {href && <meta property="og:url" content={href} />}
      {image && <meta property="og:image" content={image} />}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && authorUrl && (
        <meta property="article:author" content={authorUrl} />
      )}

      {/* Twitter Cards */}
      <meta
        name="twitter:card"
        content={image ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  )
}

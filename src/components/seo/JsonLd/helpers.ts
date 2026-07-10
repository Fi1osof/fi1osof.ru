import {
  ImageObjectSchema,
  ArticleSchema,
  BlogPostingSchema,
  WebSiteSchema,
  WebPageSchema,
  ProductSchema,
  PersonSchema,
  OrganizationSchema,
  BreadcrumbListSchema,
  WithContext,
  LocalBusinessSchema,
} from './types'

export const createImageObject = (
  data: Omit<ImageObjectSchema, '@type'>,
): WithContext<'ImageObject'> & ImageObjectSchema => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  ...data,
})

export const createArticle = (
  data: Omit<ArticleSchema, '@type'>,
): WithContext<'Article'> & ArticleSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  ...data,
})

export const createBlogPosting = (
  data: Omit<BlogPostingSchema, '@type'>,
): WithContext<'BlogPosting'> & BlogPostingSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  ...data,
})

export const createWebSite = (
  data: Omit<WebSiteSchema, '@type'>,
): WithContext<'WebSite'> & WebSiteSchema => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  ...data,
})

export const createWebPage = (
  data: Omit<WebPageSchema, '@type'>,
): WithContext<'WebPage'> & WebPageSchema => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  ...data,
})

export const createProduct = (
  data: Omit<ProductSchema, '@type'>,
): WithContext<'Product'> & ProductSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  ...data,
})

export const createPerson = (
  data: Omit<PersonSchema, '@type'>,
): WithContext<'Person'> & PersonSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  ...data,
})

export const createOrganization = (
  data: Omit<OrganizationSchema, '@type'>,
): WithContext<'Organization'> & OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  ...data,
})

export const createBreadcrumbList = ({
  items,
  siteOrigin,
}: {
  items: { name: string; url?: string }[]
  siteOrigin: string
}): WithContext<'BreadcrumbList'> & BreadcrumbListSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: item.name,
    item: !item.url
      ? undefined
      : item.url === '/'
        ? siteOrigin
        : `${siteOrigin}${item.url}`,
  })),
})

export const createLocalBusiness = (
  data: Omit<LocalBusinessSchema, '@type'>,
): WithContext<'LocalBusiness'> & LocalBusinessSchema => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  ...data,
})

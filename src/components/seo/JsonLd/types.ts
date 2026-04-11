export interface WithContext<T> {
  '@context': 'https://schema.org'
  '@type': T
}

export interface PersonSchema {
  '@type': 'Person'
  name?: string
  url?: string
  image?: string
}

export interface OrganizationSchema {
  '@type': 'Organization'
  name?: string
  url?: string
  logo?: string
}

export interface ImageObjectSchema {
  '@type': 'ImageObject'
  contentUrl: string
  caption?: string
  description?: string
  width?: number
  height?: number
}

export interface ArticleSchema {
  '@type': 'Article'
  headline: string
  description?: string
  image?: string | ImageObjectSchema
  datePublished?: string | Date | null
  dateModified?: string | Date | null
  author?: PersonSchema | OrganizationSchema
  publisher?: OrganizationSchema
}

export interface BlogPostingSchema {
  '@type': 'BlogPosting'
  headline: string
  description?: string
  image?: string | ImageObjectSchema
  datePublished?: string | Date | null
  dateModified?: string | Date | null
  author?: PersonSchema | OrganizationSchema
  publisher?: OrganizationSchema
}

export interface WebSiteSchema {
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  publisher?: OrganizationSchema
}

export interface WebPageSchema {
  '@type': 'WebPage'
  name: string
  url?: string
  description?: string
  isPartOf?: { '@type': 'WebSite'; name: string; url: string }
}

export interface ProductSchema {
  '@type': 'Product'
  name: string
  description?: string
  image?: string | ImageObjectSchema
  brand?: OrganizationSchema
  offers?: {
    '@type': 'Offer'
    price: number
    priceCurrency: string
    availability?: string
  }
}

export interface BreadcrumbListSchema {
  '@type': 'BreadcrumbList'
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }[]
}

export type SchemaType =
  | (WithContext<'ImageObject'> & ImageObjectSchema)
  | (WithContext<'Article'> & ArticleSchema)
  | (WithContext<'BlogPosting'> & BlogPostingSchema)
  | (WithContext<'WebSite'> & WebSiteSchema)
  | (WithContext<'WebPage'> & WebPageSchema)
  | (WithContext<'Product'> & ProductSchema)
  | (WithContext<'BreadcrumbList'> & BreadcrumbListSchema)
  | (WithContext<'Person'> & PersonSchema)
  | (WithContext<'Organization'> & OrganizationSchema)

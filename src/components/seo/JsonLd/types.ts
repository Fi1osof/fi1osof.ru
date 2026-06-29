export interface WithContext<T> {
  '@context': 'https://schema.org'
  '@type': T
}

export interface PersonSchema {
  '@type': 'Person'
  name?: string
  url?: string
  image?: string
  jobTitle?: string
  sameAs?: string[]
  knowsAbout?: string[]
  description?: string
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
  image?: string
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

export interface LocalBusinessSchema {
  '@type': 'LocalBusiness'
  name: string
  url?: string
  logo?: string
  image?: string
  description?: string
  telephone?: string | string[]
  email?: string | string[]
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHoursSpecification?: {
    '@type': 'OpeningHoursSpecification'
    dayOfWeek: string[]
    opens: string
    closes: string
  }[]
  priceRange?: string
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
  | (WithContext<'LocalBusiness'> & LocalBusinessSchema)

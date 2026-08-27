import slugify from '@sindresorhus/slugify'

export function slugifyUri(uri: string): string {
  return uri
    .split('/')
    .map((segment) => (segment ? slugify(segment) : segment))
    .join('/')
}

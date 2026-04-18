export type ImageSize =
  | 'avatar'
  | 'thumb'
  | 'small'
  | 'middle'
  | 'big'
  | 'origin'

type GetResizedImagePathParams = {
  path: string
  size: ImageSize
}

export function getResizedImagePath({
  path,
  size,
}: GetResizedImagePathParams): string {
  return `/images/resized/${size}/${path}`
}

import { ImgHTMLAttributes } from 'react'
import { ImageSize } from 'src/helpers/getResizedImagePath'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  size?: ImageSize
}

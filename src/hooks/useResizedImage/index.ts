import { useMemo } from 'react'
import { getResizedImagePath, ImageSize } from 'src/helpers/getResizedImagePath'

type UseResizedImageParams = {
  path: string | null | undefined
  size: ImageSize
}

export function useResizedImage({ path, size }: UseResizedImageParams) {
  return useMemo<string | null>(() => {
    return path ? getResizedImagePath({ path, size }) : null
  }, [path, size])
}

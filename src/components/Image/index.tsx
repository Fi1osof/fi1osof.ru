import React, { useMemo } from 'react'
import { ImageProps } from './interfaces'
import { ImageStyled } from './styles'
import { ImagePopup } from 'src/components/ImagePopup'
import { useBoolean } from 'src/hooks/useBoolean'

export const Image: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [isOpen, handleOpen, handleClose] = useBoolean()

  const { middle, big } = useMemo(() => {
    let middle: string | undefined
    let big: string | undefined

    const match = src.match(/^(\/images\/resized\/)([^/]+)\/(.+)$/)

    if (match) {
      middle = `${match[1]}middle/${match[3]}`
      big = `${match[1]}big/${match[3]}`
    }

    return {
      middle: middle || src,
      big: big || src,
    }
  }, [src])

  return (
    <>
      <ImageStyled
        src={middle}
        alt={alt ?? ''}
        onClick={handleOpen}
        {...props}
      />
      <ImagePopup src={big} alt={alt} isOpen={isOpen} onClose={handleClose} />
    </>
  )
}

import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { LlmImageGenerationImageSizeInput } from 'src/gql/generated'
import { Select, SelectOption } from 'src/ui-kit/controls/Select'
import { isImageSize } from '../helpers/isImageSize'

const imageSizeOptions: SelectOption[] = Object.values(
  LlmImageGenerationImageSizeInput,
).map((value) => ({
  value,
  label: value,
}))

type ImageSizeProps = {
  imageSize: LlmImageGenerationImageSizeInput
  imageSizeSetter: Dispatch<SetStateAction<LlmImageGenerationImageSizeInput>>
}

export const ImageSize: React.FC<ImageSizeProps> = ({
  imageSize,
  imageSizeSetter,
}) => {
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value

      if (isImageSize(value)) {
        imageSizeSetter(value)
      }
    },
    [imageSizeSetter],
  )

  return (
    <Select value={imageSize} onChange={onChange} options={imageSizeOptions} />
  )
}

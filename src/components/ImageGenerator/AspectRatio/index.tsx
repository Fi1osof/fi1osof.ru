import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { LlmImageGenerationAspectRatioInput } from 'src/gql/generated'
import {
  ImageGenerationAspectRatioButtonStyled,
  ImageGenerationAspectRatioStyled,
} from './styles'
import { isAspectRatio } from '../helpers/isAspectRatio'
import { ComponentVariant } from 'src/ui-kit/interfaces'

const aspectRatioMap: Record<
  LlmImageGenerationAspectRatioInput,
  { label: string; width: number; height: number }
> = {
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_1_1]: {
    label: '1:1',
    width: 1,
    height: 1,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_2_3]: {
    label: '2:3',
    width: 2,
    height: 3,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_3_2]: {
    label: '3:2',
    width: 3,
    height: 2,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_3_4]: {
    label: '3:4',
    width: 3,
    height: 4,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_4_3]: {
    label: '4:3',
    width: 4,
    height: 3,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_4_5]: {
    label: '4:5',
    width: 4,
    height: 5,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_5_4]: {
    label: '5:4',
    width: 5,
    height: 4,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_9_16]: {
    label: '9:16',
    width: 9,
    height: 16,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_16_9]: {
    label: '16:9',
    width: 16,
    height: 9,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_21_9]: {
    label: '21:9',
    width: 21,
    height: 9,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_1_4]: {
    label: '1:4',
    width: 1,
    height: 3,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_4_1]: {
    label: '4:1',
    width: 3,
    height: 1,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_1_8]: {
    label: '1:8',
    width: 1,
    height: 6,
  },
  [LlmImageGenerationAspectRatioInput.ASPECTRATIO_8_1]: {
    label: '8:1',
    width: 6,
    height: 1,
  },
}

type ImageGenerationAspectRatioProps = {
  aspectRatio: LlmImageGenerationAspectRatioInput
  aspectRatioSetter: Dispatch<
    SetStateAction<LlmImageGenerationAspectRatioInput>
  >
}

export const ImageGenerationAspectRatio: React.FC<
  ImageGenerationAspectRatioProps
> = ({ aspectRatio, aspectRatioSetter, ...other }) => {
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = event.currentTarget.value

      if (isAspectRatio(value)) {
        aspectRatioSetter(value)
      }
    },
    [aspectRatioSetter],
  )

  const buttons = useMemo<React.ReactNode[]>(() => {
    return Object.values(LlmImageGenerationAspectRatioInput).map((n) => {
      const { label, width, height } = aspectRatioMap[n]

      return (
        <ImageGenerationAspectRatioButtonStyled
          key={n}
          type="button"
          value={n}
          onClick={onClick}
          $aspectRatio={width / height}
          variant={
            n === aspectRatio
              ? ComponentVariant.PRIMARY
              : ComponentVariant.DEFAULT
          }
        >
          {label}
        </ImageGenerationAspectRatioButtonStyled>
      )
    })
  }, [onClick, aspectRatio])

  return (
    <ImageGenerationAspectRatioStyled {...other}>
      {buttons}
    </ImageGenerationAspectRatioStyled>
  )
}

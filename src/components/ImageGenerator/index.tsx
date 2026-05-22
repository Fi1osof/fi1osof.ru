import {
  LlmImageGenerationAspectRatioInput,
  LlmImageGenerationImageSizeInput,
  LlmModel,
  LlmProvider,
  useLlmImageGenerationMutation,
} from 'src/gql/generated'
import { ImageGeneratorControlsStyled, ImageGeneratorStyled } from './styles'
import { Textarea } from 'src/ui-kit/controls/Textarea'
import { useCallback, useState } from 'react'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { Button } from 'src/ui-kit/Button'
import { ImageGenerationAspectRatio } from './AspectRatio'
import { ImageSize } from './ImageSize'

export const ImageGenerator: React.FC = () => {
  const [prompt, promptSetter] = useState('')

  const [aspectRatio, aspectRatioSetter] =
    useState<LlmImageGenerationAspectRatioInput>(
      LlmImageGenerationAspectRatioInput.ASPECTRATIO_16_9,
    )

  const [imageSize, imageSizeSetter] =
    useState<LlmImageGenerationImageSizeInput>(
      LlmImageGenerationImageSizeInput.IMAGESIZE_1K,
    )

  const { addMessage } = useSnackbar() || {}

  const [mutation, { loading }] = useLlmImageGenerationMutation()

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      promptSetter(event.currentTarget.value)
    },
    [],
  )

  const [src, srcSetter] = useState('')

  const onClickSend = useCallback(() => {
    promptSetter((prompt) => {
      mutation({
        variables: {
          input: {
            provider: LlmProvider.OPENROUTER,
            model: LlmModel.GEMINI3_1_FLASH_IMAGE,
            prompt,
            aspectRatio,
            imageSize,
          },
        },
      })
        .then((r) => {
          const imageUrl = r.data?.llmImageGeneration.choices
            .at(0)
            ?.message.images?.at(0)?.imageUrl

          if (imageUrl) {
            srcSetter(imageUrl)
          }
        })
        .catch((error) => {
          addMessage?.(
            (error as Error | undefined)?.message ||
              'Ошибка выполнения запроса',
          )
        })

      return prompt
    })
  }, [mutation, aspectRatio, imageSize, addMessage])

  return (
    <ImageGeneratorStyled>
      <ImageGeneratorControlsStyled>
        <div>
          <Textarea value={prompt} onChange={onChange} rows={20} />
        </div>

        <div>
          <ImageSize imageSize={imageSize} imageSizeSetter={imageSizeSetter} />

          <ImageGenerationAspectRatio
            aspectRatio={aspectRatio}
            aspectRatioSetter={aspectRatioSetter}
          />
        </div>
      </ImageGeneratorControlsStyled>

      <div>
        <Button onClick={onClickSend} disabled={!prompt || loading}>
          Generate image
        </Button>
      </div>

      {src && <img src={src} />}
    </ImageGeneratorStyled>
  )
}

import {
  LlmImageGenerationAspectRatioInput,
  LlmImageGenerationImageSizeInput,
  LlmModel,
  LlmProvider,
  useLlmImageGenerationMutation,
} from 'src/gql/generated'
import {
  ImageGeneratorControlsStyled,
  ImageGeneratorResultsStyled,
  ImageGeneratorStyled,
} from './styles'
import { Textarea } from 'src/ui-kit/controls/Textarea'
import { useCallback, useState } from 'react'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { Button } from 'src/ui-kit/Button'
import { ImageGenerationAspectRatio } from './AspectRatio'
import { ImageSize } from './ImageSize'
import { ModelSelect } from './ModelSelect'

type ImageResult = {
  key: string
  model: LlmModel
  imageUrl: string | null
  loading: boolean
  error: string | null
}

export const ImageGenerator: React.FC = () => {
  const [prompt, promptSetter] = useState('')
  const [models, modelsSetter] = useState<LlmModel[]>([
    LlmModel.GEMINI3_1_FLASH_IMAGE,
  ])
  const [multipleModels, multipleModelsSetter] = useState(false)

  const [aspectRatio, aspectRatioSetter] =
    useState<LlmImageGenerationAspectRatioInput>(
      LlmImageGenerationAspectRatioInput.ASPECTRATIO_16_9,
    )

  const [imageSize, imageSizeSetter] =
    useState<LlmImageGenerationImageSizeInput>(
      LlmImageGenerationImageSizeInput.IMAGESIZE_1K,
    )

  const { addMessage } = useSnackbar() || {}

  const [mutation] = useLlmImageGenerationMutation()

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      promptSetter(event.currentTarget.value)
    },
    [],
  )

  const [results, resultsSetter] = useState<ImageResult[]>([])

  const loading = results.some((r) => r.loading)

  const onClickSend = useCallback(() => {
    const currentPrompt = prompt

    const initialResults: ImageResult[] = models.map((m) => ({
      key: crypto.randomUUID(),
      model: m,
      imageUrl: null,
      loading: true,
      error: null,
    }))

    resultsSetter(initialResults)

    models.forEach((m, index) => {
      mutation({
        variables: {
          input: {
            provider: LlmProvider.OPENROUTER,
            model: m,
            prompt: currentPrompt,
            aspectRatio,
            imageSize,
          },
        },
      })
        .then((r) => {
          const imageUrl =
            r.data?.llmImageGeneration.choices.at(0)?.message.images?.at(0)
              ?.imageUrl ?? null

          resultsSetter((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, imageUrl, loading: false } : item,
            ),
          )
        })
        .catch((error) => {
          const errorMessage =
            (error as Error | undefined)?.message || 'Request execution error'

          addMessage?.(errorMessage, {
            variant: 'error',
          })

          resultsSetter((prev) =>
            prev.map((item, i) =>
              i === index
                ? { ...item, error: errorMessage, loading: false }
                : item,
            ),
          )
        })
    })
  }, [mutation, aspectRatio, imageSize, addMessage, models, prompt])

  return (
    <ImageGeneratorStyled>
      <ImageGeneratorControlsStyled>
        <div>
          <Textarea value={prompt} onChange={onChange} rows={20} />
        </div>

        <div>
          <ImageSize imageSize={imageSize} imageSizeSetter={imageSizeSetter} />

          <ModelSelect
            models={models}
            modelsSetter={modelsSetter}
            multiple={multipleModels}
            multipleSetter={multipleModelsSetter}
          />

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

      {results.length > 0 && (
        <ImageGeneratorResultsStyled>
          {results.map((result) => (
            <div key={result.key}>
              <div>{result.model}</div>
              {result.loading && <div>Loading...</div>}
              {result.error && <div>Error: {result.error}</div>}
              {result.imageUrl && <img src={result.imageUrl} />}
            </div>
          ))}
        </ImageGeneratorResultsStyled>
      )}
    </ImageGeneratorStyled>
  )
}

import {
  LlmProvider,
  LlmSpeechFormat,
  useLlmSpeechGenerationMutation,
} from 'src/gql/generated'
import {
  AdminTtsPageViewFormButtonsStyled,
  AdminTtsPageViewFormStyled,
  AdminTtsPageViewFormWrapperStyled,
  AdminTtsPageViewStyled,
} from './styles'
import { FormControl } from 'src/ui-kit/FormControl'
import { Textarea } from 'src/ui-kit/controls/Textarea'
import { TextField } from 'src/ui-kit/controls/TextField'
import { Select, SelectOption } from 'src/ui-kit/controls/Select'
import {
  GEMINI_TTS_MODEL,
  GeminiTtsLanguage,
  GeminiTtsVoice,
  geminiTtsLanguageOptions,
  geminiTtsVoiceOptions,
} from './options'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from 'src/ui-kit/Button'
import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TtsFormData as FormData } from './interfaces'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { ComponentVariant } from 'src/ui-kit/interfaces'

const schema: yup.ObjectSchema<FormData> = yup.object({
  text: yup
    .string()
    .required('Enter text to synthesize')
    .test('not-blank', 'Enter text to synthesize', (value) =>
      Boolean(value?.trim()),
    ),
  prompt: yup.string().nullable(),
  language: yup
    .string()
    .nullable()
    .when('model', {
      is: GEMINI_TTS_MODEL,
      then: (schema) =>
        schema.oneOf(
          ['', ...Object.values(GeminiTtsLanguage)],
          'Select a supported Gemini language',
        ),
    }),
  model: yup.string().trim().required('Enter a model'),
  voice: yup
    .string()
    .nullable()
    .when('model', {
      is: GEMINI_TTS_MODEL,
      then: (schema) =>
        schema
          .oneOf(
            Object.values(GeminiTtsVoice),
            'Select a supported Gemini voice',
          )
          .required('Select a voice'),
    }),
  speed: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Enter a number')
    .min(0.25)
    .max(4),
})

export const AdminTtsPageView: React.FC = () => {
  const form = useForm<FormData>({
    defaultValues: {
      text: '',
      prompt: '',
      language: '',
      model: GEMINI_TTS_MODEL,
      voice: GeminiTtsVoice.Kore,
      speed: 1,
    },
    resolver: yupResolver(schema),
    shouldFocusError: false,
    reValidateMode: 'onChange',
    mode: 'all',
  })
  const isGeminiModel = form.watch('model').trim() === GEMINI_TTS_MODEL
  const formRef = useRef<HTMLFormElement>(null)
  const submittingRef = useRef(false)
  const [mutation, { data, loading }] = useLlmSpeechGenerationMutation()
  const audio = data?.llmSpeechGeneration
  const canSubmit =
    form.formState.isValid && !form.formState.isSubmitting && !loading

  const { addMessage } = useSnackbar() || {}

  const handleSubmit = useCallback(
    async (values: FormData) => {
      if (loading || submittingRef.current) {
        return
      }
      submittingRef.current = true
      const model = values.model.trim()
      const isGeminiTts = model === GEMINI_TTS_MODEL
      try {
        await mutation({
          variables: {
            input: {
              ...values,
              provider: LlmProvider.OPENROUTER,
              model,
              prompt: values.prompt?.trim() || undefined,
              language: values.language?.trim() || undefined,
              voice: values.voice?.trim() || undefined,
              speed: isGeminiTts ? undefined : (values.speed ?? undefined),
              responseFormat: isGeminiTts
                ? LlmSpeechFormat.WAV
                : LlmSpeechFormat.MP3,
            },
          },
        })
      } catch (error) {
        addMessage?.((error as Error).message || 'Speech generation failed', {
          variant: 'error',
        })
      } finally {
        submittingRef.current = false
      }
    },
    [addMessage, loading, mutation],
  )

  const fieldRenderer = useCallback<
    ControllerProps<FormData, keyof FormData>['render']
  >(
    ({
      field: { name, value, onChange, onBlur, ref },
      fieldState: { error },
    }) => {
      let label: string
      let helperText: string | undefined
      let rows: number | undefined
      let required = false
      let options: SelectOption[] | undefined
      switch (name) {
        case 'text':
          label = 'Text'
          helperText =
            'Ctrl+Enter or Shift+Enter to send. Enter adds a new line.'
          rows = 8
          required = true
          break
        case 'prompt':
          label = 'User prompt'
          helperText = 'Voice and style instructions (Gemini TTS / OpenAI).'
          rows = 3
          break
        case 'language':
          label = 'Language'
          options = isGeminiModel ? geminiTtsLanguageOptions : undefined
          helperText =
            'Optional language hint, e.g. ru or en-US (Gemini TTS / OpenAI). The text is not translated.'
          break
        case 'model':
          label = 'Model'
          required = true
          break
        case 'voice':
          label = 'Voice'
          options = isGeminiModel ? geminiTtsVoiceOptions : undefined
          required = isGeminiModel
          helperText = isGeminiModel
            ? 'Gemini voices with their documented delivery styles.'
            : 'Voice ID supported by the selected model.'
          break
        case 'speed':
          label = 'Speed'
          helperText =
            'Only applies to models supporting this parameter. For Gemini, describe the pace in User prompt.'
          break
      }
      const inputProps = {
        name,
        value: value ?? '',
        onChange,
        onBlur,
        required,
        'aria-label': label,
        'aria-invalid': Boolean(error),
      }
      return (
        <FormControl
          label={label}
          required={required}
          error={Boolean(error)}
          helperText={error?.message ?? helperText}
        >
          {options ? (
            <Select {...inputProps} ref={ref} options={options} />
          ) : rows ? (
            <Textarea {...inputProps} ref={ref} rows={rows} />
          ) : (
            <TextField
              {...inputProps}
              ref={ref}
              type={name === 'speed' ? 'number' : 'text'}
              min={name === 'speed' ? 0.25 : undefined}
              max={name === 'speed' ? 4 : undefined}
              step={name === 'speed' ? 0.05 : undefined}
              placeholder={name === 'language' ? 'Auto' : undefined}
            />
          )}
        </FormControl>
      )
    },
    [isGeminiModel],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== 'Enter' ||
        (!event.ctrlKey && !event.shiftKey) ||
        event.altKey ||
        event.isComposing ||
        event.repeat
      ) {
        return
      }
      event.preventDefault()
      if (!submittingRef.current) {
        formRef.current?.requestSubmit()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AdminTtsPageViewStyled>
      <FormProvider {...form}>
        <AdminTtsPageViewFormStyled
          ref={formRef}
          aria-busy={loading}
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
        >
          <AdminTtsPageViewFormWrapperStyled>
            <div>
              <Controller name="text" render={fieldRenderer} />
              <Controller name="prompt" render={fieldRenderer} />
              <AdminTtsPageViewFormButtonsStyled>
                <Button disabled={!canSubmit} type="submit">
                  {loading ? 'Generating…' : 'Send'}
                </Button>
                <Button
                  variant={ComponentVariant.DEFAULT}
                  onClick={useCallback(() => form.reset(), [form])}
                >
                  Reset
                </Button>
              </AdminTtsPageViewFormButtonsStyled>
            </div>

            <div>
              <Controller name="language" render={fieldRenderer} />
              <Controller name="voice" render={fieldRenderer} />
              <Controller name="speed" render={fieldRenderer} />
              <Controller name="model" render={fieldRenderer} />

              {audio?.audioUrl && (
                <div>
                  <audio
                    key={audio.audioUrl}
                    controls
                    src={audio.audioUrl}
                    aria-label="Generated speech"
                    autoPlay
                  />
                  <div>
                    <a
                      href={audio.audioUrl}
                      download={`speech.${audio.format}`}
                    >
                      Download audio
                    </a>
                  </div>
                </div>
              )}
            </div>
          </AdminTtsPageViewFormWrapperStyled>
        </AdminTtsPageViewFormStyled>
      </FormProvider>
    </AdminTtsPageViewStyled>
  )
}

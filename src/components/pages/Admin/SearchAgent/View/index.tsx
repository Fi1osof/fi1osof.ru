import React, { useCallback, useState } from 'react'
import { SearchAgentFormStyled, SearchAgentPageViewStyled } from './styles'
import {
  LlmChatMessageRole,
  LlmModel,
  LlmProvider,
  useLlmChatCompletionMutation,
} from 'src/gql/generated'

import * as yup from 'yup'
import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { Textarea } from 'src/ui-kit/controls/Textarea'
import { Markdown } from 'src/components/Markdown'

type FormData = {
  message: string
  max_uses: number
  allowed_domains?: string
}

function getDefaultValues(): FormData {
  return {
    message: '',
    max_uses: 1,
    allowed_domains: '',
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  message: yup.string().required('Message is required'),
  max_uses: yup
    .number()
    .required('Max uses is required')
    .min(1, 'Min value is 1'),
  allowed_domains: yup.string(),
})

export const SearchAgentPageView: React.FC = () => {
  const [result, resultSetter] = useState('')

  const { addMessage } = useSnackbar() || {}

  const [mutation, { loading }] = useLlmChatCompletionMutation()

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(),
    resolver: yupResolver(schema),
    shouldFocusError: false,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const onSubmit = useCallback(
    (event: React.SubmitEvent) => {
      event.preventDefault()

      form
        .trigger()
        .then(async (isValid) => {
          resultSetter('')

          if (isValid) {
            const { message, max_uses, allowed_domains } = form.getValues()

            const allowedDomainsArray = allowed_domains
              ? allowed_domains
                  .split(',')
                  .map((d) => d.trim())
                  .filter(Boolean)
              : undefined

            mutation({
              variables: {
                input: {
                  provider: LlmProvider.OPENROUTER,
                  model: LlmModel.ANTHROPIC_CLAUDE_HAIKU_4_5,
                  messages: [
                    {
                      role: LlmChatMessageRole.USER,
                      content: message,
                    },
                  ],
                  tools: [
                    {
                      type: 'openrouter:web_search',
                      parameters: {
                        engine: 'native',
                        max_uses:
                          typeof max_uses === 'string'
                            ? parseInt(max_uses)
                            : max_uses,
                        ...(allowedDomainsArray?.length && {
                          allowed_domains: allowedDomainsArray,
                        }),
                      },
                    },
                  ],
                },
              },
            })
              .then((r) => {
                const content = r.data?.response?.choices?.[0]?.message?.content
                if (content) {
                  addMessage?.('Request completed', { variant: 'success' })

                  resultSetter(content)
                } else {
                  addMessage?.('No response content', { variant: 'warning' })
                }
              })
              .catch((error) => {
                const errorMessage = error.message || 'Request error'
                addMessage?.(errorMessage, { variant: 'error' })
              })
          } else {
            console.error('Form errors', form.formState.errors)
            addMessage?.('Please, check form', { variant: 'warning' })
          }
        })
        .catch((error) => {
          console.error(error)
          addMessage?.('Unexpected error', { variant: 'error' })
        })
    },
    [addMessage, form, mutation],
  )

  const fieldRenderer = useCallback<
    ControllerProps<
      FormData,
      'message' | 'max_uses' | 'allowed_domains'
    >['render']
  >(({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
    let label: string

    const helperText = undefined

    let type: 'text' | 'number' | undefined = undefined

    let EditorComponent:
      | typeof TextField
      | typeof Textarea
      | React.FC<{
          value: string
        }>
      | React.FC<React.HtmlHTMLAttributes<HTMLSelectElement>> = TextField

    switch (name) {
      case 'message':
        label = 'Message'
        EditorComponent = Textarea
        break
      case 'max_uses':
        label = 'Max uses'
        type = 'number'
        break
      case 'allowed_domains':
        label = 'Allowed domains (comma separated, optional)'
        break
    }

    return (
      <FormControl
        label={label}
        helperText={error ? error.message : helperText}
        error={!!error}
      >
        <EditorComponent
          value={value?.toString() || ''}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
        />
      </FormControl>
    )
  }, [])

  return (
    <SearchAgentPageViewStyled>
      <FormProvider {...form}>
        <SearchAgentFormStyled onSubmit={onSubmit}>
          <Controller name="message" render={fieldRenderer} />
          <Controller name="max_uses" render={fieldRenderer} />
          <Controller name="allowed_domains" render={fieldRenderer} />

          <div>
            <Button
              variant={ComponentVariant.SUCCESS}
              type="submit"
              disabled={loading}
            >
              Search
            </Button>
          </div>
        </SearchAgentFormStyled>
      </FormProvider>

      {result && <Markdown>{result}</Markdown>}
    </SearchAgentPageViewStyled>
  )
}

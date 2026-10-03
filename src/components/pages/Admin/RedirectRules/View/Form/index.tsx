import React, { useCallback } from 'react'
import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { RedirectRuleFormButtonsStyled, RedirectRuleFormStyled } from './styles'
import { RedirectRuleFormData, redirectRuleSchemaSchema } from './interfaces'
import {
  CreateRedirectRuleMutation,
  RedirectPatternType,
  useCreateRedirectRuleMutation,
} from 'src/gql/generated'
import { FormControl } from 'src/ui-kit/FormControl'
import { TextField } from 'src/ui-kit/controls/TextField'
import { Select } from 'src/ui-kit/controls/Select'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { Button } from 'src/ui-kit/Button'
import { Checkbox } from 'src/ui-kit/controls/Checkbox'
import { ComponentVariant } from 'src/ui-kit/interfaces'

const patternTypeOptions = [
  { value: RedirectPatternType.EXACT, label: 'Exact' },
  { value: RedirectPatternType.PREFIX, label: 'Prefix' },
  { value: RedirectPatternType.REGEX, label: 'Regex' },
]

export interface RedirectRuleFormProps {
  cancelHandler: (() => void) | undefined
  onSuccessHandler?: (data: CreateRedirectRuleMutation['response']) => void
}

export const RedirectRuleForm: React.FC<RedirectRuleFormProps> = ({
  cancelHandler,
  onSuccessHandler,
}) => {
  const form = useForm<RedirectRuleFormData>({
    defaultValues: {
      name: '',
      pattern: '',
      patternType: RedirectPatternType.EXACT,
      replacement: '',
      enabled: true,
      priority: 0,
      statusCode: 301,
      comment: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(redirectRuleSchemaSchema),
  })

  const { addMessage } = useSnackbar() || {}

  const [createMutation, { loading }] = useCreateRedirectRuleMutation({})

  const onSubmit = useCallback(
    (e: React.SubmitEvent) => {
      e.preventDefault()

      form.trigger().then(async (isValid) => {
        if (isValid) {
          const data = form.getValues()

          try {
            await createMutation({
              variables: {
                data,
              },
            }).then((r) => {
              if (r.data?.response) {
                addMessage?.('Redirect rule created', { variant: 'success' })
                onSuccessHandler?.(r.data.response)
              } else {
                throw new Error('Failed to create redirect rule')
              }
            })
          } catch (error) {
            addMessage?.(
              (error as Error).message || 'Something wrong. Try later',
              {
                variant: 'error',
              },
            )
          }
        }
      })
    },
    [addMessage, form, onSuccessHandler, createMutation],
  )

  const fieldRenderer = useCallback<
    ControllerProps<RedirectRuleFormData>['render']
  >(
    ({
      field: { name, value, onChange, onBlur, ref },
      fieldState: { error },
    }) => {
      let label: string
      let required = false
      let type = 'text'

      switch (name) {
        case 'name':
          label = 'Name'
          required = true
          break
        case 'pattern':
          label = 'Pattern'
          required = true
          break
        case 'patternType':
          label = 'Pattern Type'
          required = true
          break
        case 'replacement':
          label = 'Replacement'
          required = true
          break
        case 'enabled':
          label = 'Enabled'
          break
        case 'priority':
          label = 'Priority'
          type = 'number'
          break
        case 'statusCode':
          label = 'Status Code'
          type = 'number'
          break
        case 'comment':
          label = 'Comment'
          break
        default:
          label = name
      }

      const inputProps = {
        name,
        // value: value ?? '',
        onChange,
        onBlur,
        disabled: loading,
        'aria-label': label,
        'aria-invalid': Boolean(error),
      }

      return (
        <FormControl
          label={label}
          required={required}
          helperText={error?.message}
          error={!!error}
        >
          {typeof value === 'boolean' ? (
            <>
              <Checkbox
                checked={value === true}
                {...inputProps}
                label={label}
              />
            </>
          ) : name === 'patternType' ? (
            <Select
              {...inputProps}
              ref={ref}
              options={patternTypeOptions}
              value={value ?? ''}
            />
          ) : (
            <TextField
              {...inputProps}
              ref={ref}
              type={type}
              value={value ?? ''}
            />
          )}
        </FormControl>
      )
    },
    [loading],
  )

  return (
    <RedirectRuleFormStyled onSubmit={onSubmit}>
      <FormProvider {...form}>
        <Controller name="name" render={fieldRenderer} />
        <Controller name="pattern" render={fieldRenderer} />
        <Controller name="patternType" render={fieldRenderer} />
        <Controller name="replacement" render={fieldRenderer} />
        <Controller name="enabled" render={fieldRenderer} />
        <Controller name="priority" render={fieldRenderer} />
        <Controller name="statusCode" render={fieldRenderer} />
        <Controller name="comment" render={fieldRenderer} />

        <RedirectRuleFormButtonsStyled>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>

          {cancelHandler && (
            <Button
              variant={ComponentVariant.SECONDARY}
              type="button"
              onClick={cancelHandler}
            >
              Cancel
            </Button>
          )}
        </RedirectRuleFormButtonsStyled>
      </FormProvider>
    </RedirectRuleFormStyled>
  )
}

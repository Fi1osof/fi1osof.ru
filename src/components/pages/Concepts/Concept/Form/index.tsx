import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { ConceptEditFormStyled, ConceptEditFormToolbarStyled } from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  KbConceptFragment,
  KbConceptUpdateInput,
  useUpdateConceptMutation,
} from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { FileUploader, FileUploaderProps } from 'src/components/FileUploader'

const MarkdownEditor = dynamic(
  () => import('src/components/Markdown/Editor').then((r) => r.MarkdownEditor),
  {
    ssr: false,
  },
)

type FormData = KbConceptUpdateInput

function getDefaultValues(concept: KbConceptFragment): FormData {
  return {
    name: concept?.name ?? '',
    description: concept?.description ?? '',
    content: concept?.content ?? '',
    type: concept?.type ?? '',
    code: concept?.code ?? '',
    image: concept?.image ?? '',
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  content: yup.string(),
  type: yup.string(),
  code: yup.string(),
  image: yup.string(),
  data: yup.mixed(),
  parentId: yup.string(),
  rootId: yup.string(),
})

type ConceptEditFormProps = {
  concept: KbConceptFragment
  cancelHandler: () => void
}

export const ConceptEditForm: React.FC<ConceptEditFormProps> = ({
  concept,
  cancelHandler,
}) => {
  const { addMessage } = useSnackbar() || {}

  const [updateConceptMutation, { loading }] = useUpdateConceptMutation()

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(concept),
    resolver: yupResolver(schema),
    shouldFocusError: false,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()

      form
        .trigger()
        .then(async (reason) => {
          if (reason === true) {
            const data = form.getValues()

            updateConceptMutation({
              variables: {
                data,
                where: {
                  id: concept.id,
                },
              },
            })
              .then((r) => {
                const updatedConcept = r.data?.response

                if (updatedConcept) {
                  addMessage?.('Success', {
                    variant: 'success',
                  })

                  cancelHandler?.()
                } else {
                  addMessage?.('Error', { variant: 'error' })
                }
              })
              .catch((error) => {
                const errorMessage = error.message || 'Request error'
                addMessage?.(errorMessage, { variant: 'error' })
              })
          } else {
            console.error('Form errors', form.formState.errors)

            const errorMessage = 'Please, check form'
            addMessage?.(errorMessage, { variant: 'warning' })
          }
        })
        .catch((error) => {
          console.error(error)
          addMessage?.('Unexpected error', {
            variant: 'error',
          })
        })
    },
    [addMessage, concept.id, form, updateConceptMutation, cancelHandler],
  )

  const onChangeImage = useCallback<NonNullable<FileUploaderProps['onChange']>>(
    (file) => {
      if (file?.path) {
        form.setValue('image', file.path, {
          shouldValidate: true,
        })
      }
    },
    [form],
  )

  const fieldRenderer = useCallback<
    ControllerProps<
      FormData,
      'name' | 'description' | 'content' | 'type' | 'code' | 'image'
    >['render']
  >(
    ({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
      let label: string
      const helperText = undefined
      let EditorComponent:
        | typeof TextField
        | typeof MarkdownEditor
        | React.FC<{
            value: string
          }> = TextField

      switch (name) {
        case 'name':
          label = 'Name'
          break
        case 'description':
          label = 'Description'
          EditorComponent = MarkdownEditor
          break
        case 'content':
          label = 'Content'
          EditorComponent = MarkdownEditor
          break
        case 'type':
          label = 'Type'
          break
        case 'code':
          label = 'Code'
          break
        case 'image':
          label = 'Image'

          EditorComponent = ({ value }: { value: string }) => {
            return (
              <>
                <FileUploader
                  value={value ? `/images/resized/middle/${value}` : ''}
                  onChange={onChangeImage}
                />
              </>
            )
          }

          break
      }

      return (
        <FormControl
          label={label}
          helperText={error ? error.message : helperText}
          error={!!error}
        >
          <EditorComponent
            value={(value as string) || ''}
            onChange={onChange}
            onBlur={onBlur}
          />
        </FormControl>
      )
    },
    [onChangeImage],
  )

  return (
    <FormProvider {...form}>
      <ConceptEditFormStyled onSubmit={onSubmit}>
        <Controller name="image" render={fieldRenderer} />
        <Controller name="name" render={fieldRenderer} />
        <Controller name="type" render={fieldRenderer} />
        <Controller name="code" render={fieldRenderer} />
        <Controller name="description" render={fieldRenderer} />
        <Controller name="content" render={fieldRenderer} />

        <ConceptEditFormToolbarStyled>
          {cancelHandler && (
            <Button
              variant={ComponentVariant.SECONDARY}
              type="button"
              onClick={cancelHandler}
            >
              Cancel
            </Button>
          )}

          <Button
            variant={ComponentVariant.SUCCESS}
            type="submit"
            disabled={loading}
          >
            Save
          </Button>
        </ConceptEditFormToolbarStyled>
      </ConceptEditFormStyled>
    </FormProvider>
  )
}

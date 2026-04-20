import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { FileEditFormStyled, FileEditFormToolbarStyled } from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  FileDetailedFragment,
  FileUpdateInput,
  useUpdateFileMutation,
} from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'

const MarkdownEditor = dynamic(
  () => import('src/components/Markdown/Editor').then((r) => r.MarkdownEditor),
  {
    ssr: false,
  },
)

type FormData = FileUpdateInput

function getDefaultValues(file: FileEditFormProps['file']): FormData {
  return {
    name: file?.name ?? '',
    description: file?.description ?? '',
    content: file?.content ?? '',
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  content: yup.string(),
})

type FileEditFormProps = {
  file: FileDetailedFragment
  cancelHandler: () => void
}

export const FileEditForm: React.FC<FileEditFormProps> = ({
  file,
  cancelHandler,
}) => {
  const { addMessage } = useSnackbar() || {}

  const [updateFileMutation, { loading }] = useUpdateFileMutation()

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(file),
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

            updateFileMutation({
              variables: {
                data,
                where: {
                  id: file.id,
                },
              },
            })
              .then((r) => {
                const updatedFile = r.data?.response

                if (updatedFile) {
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
    [addMessage, file.id, form, updateFileMutation, cancelHandler],
  )

  const fieldRenderer = useCallback<
    ControllerProps<FormData, 'name' | 'description' | 'content'>['render']
  >(({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
    let label: string
    const helperText = undefined
    let EditorComponent: typeof TextField | typeof MarkdownEditor = TextField

    switch (name) {
      case 'name':
        label = 'Name'
        break
      case 'description':
        label = 'Description'
        break
      case 'content':
        label = 'Content'
        EditorComponent = MarkdownEditor
        break
    }

    return (
      <FormControl
        label={label}
        helperText={error ? error.message : helperText}
        error={!!error}
      >
        <EditorComponent
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormControl>
    )
  }, [])

  return (
    <FormProvider {...form}>
      <FileEditFormStyled onSubmit={onSubmit}>
        <Controller name="name" render={fieldRenderer} />
        <Controller name="description" render={fieldRenderer} />
        <Controller name="content" render={fieldRenderer} />

        <FileEditFormToolbarStyled>
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
        </FileEditFormToolbarStyled>
      </FileEditFormStyled>
    </FormProvider>
  )
}

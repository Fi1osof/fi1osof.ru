import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import {
  ConceptEditFormFormStyled,
  ConceptEditFormStyled,
  ConceptEditFormToolbarStyled,
} from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField, TextFieldProps } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { useRouter } from 'next/router'
import {
  CreateConceptMutationVariables,
  KbConceptFragment,
  KbConceptNoNestingFragment,
  KbConceptVisibility,
  UpdateConceptMutationVariables,
  useCreateConceptMutation,
  useUpdateConceptMutation,
} from 'src/gql/generated'
import { createConceptLink } from 'src/components/Link/Concept'
import { AppContextValue } from 'src/components/AppContext'
import {
  ConceptUploader,
  ConceptUploaderProps,
} from 'src/components/Concept/ConceptUploader'

const MarkdownEditor = dynamic(
  () => import('src/components/Markdown/Editor').then((r) => r.MarkdownEditor),
  {
    ssr: false,
  },
)

type FormData =
  | UpdateConceptMutationVariables['data']
  | CreateConceptMutationVariables['data']

function getDefaultValues(concept: ConceptEditFormProps['concept']): FormData {
  return {
    name: concept?.name,
    description: concept?.description,
    intro: concept?.intro,
    content: concept && 'content' in concept ? concept?.content : undefined,
    type: concept?.type,
    image: concept?.image,
    data: concept?.data,
    parentId: concept && 'parentId' in concept ? concept?.parentId : undefined,
    rootId: concept && 'rootId' in concept ? concept?.rootId : undefined,
    quality: concept?.quality,
    uri: concept?.uri,
    visibility: concept?.visibility,
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
  intro: yup.string().nullable(),
  content: yup.string().nullable(),
  type: yup.string().nullable(),
  code: yup.string(),
  image: yup.string().nullable(),
  data: yup.mixed().nullable(),
  parentId: yup.string().nullable(),
  rootId: yup.string().nullable(),
  quality: yup.number().nullable(),
  uri: yup.string().nullable(),
  visibility: yup
    .mixed<KbConceptVisibility>()
    .oneOf(Object.values(KbConceptVisibility))
    .label('Visibility'),
})

type ConceptEditFormProps = {
  concept: KbConceptNoNestingFragment | KbConceptFragment | null | undefined
  cancelHandler: (() => void) | undefined
  currentUser: AppContextValue['user']
}

export const ConceptEditForm: React.FC<ConceptEditFormProps> = ({
  concept,
  cancelHandler,
}) => {
  const { addMessage } = useSnackbar() || {}

  const [createConceptMutation, { loading: loadingCreate }] =
    useCreateConceptMutation()
  const [updateConceptMutation, { loading: loadingUpdate }] =
    useUpdateConceptMutation()

  const loading = loadingCreate || loadingUpdate

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(concept),
    resolver: yupResolver(schema),
    shouldFocusError: false,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const router = useRouter()

  const onSubmit = useCallback(
    (event: React.SubmitEvent) => {
      event.preventDefault()

      form
        .trigger()
        .then(async (reason) => {
          if (reason === true) {
            const data = form.getValues()

            const request = concept
              ? updateConceptMutation({
                  variables: {
                    data,
                    where: {
                      id: concept.id,
                    },
                  },
                })
              : createConceptMutation({
                  variables: {
                    data,
                  },
                }).then((r) => {
                  if (r.data?.response) {
                    router.push(createConceptLink(r.data?.response))
                  }

                  return r
                })

            request
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
    [
      addMessage,
      cancelHandler,
      concept,
      createConceptMutation,
      form,
      updateConceptMutation,
      router,
    ],
  )

  const onChangeImage = useCallback<
    NonNullable<ConceptUploaderProps['onChange']>
  >(
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
      | 'name'
      | 'description'
      | 'intro'
      | 'content'
      | 'type'
      | 'image'
      | 'quality'
      | 'uri'
      | 'visibility'
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

      let otherInputProps: TextFieldProps = {}

      switch (name) {
        case 'name':
          label = 'Name'
          break
        case 'description':
          label = 'Description'
          EditorComponent = MarkdownEditor
          break
        case 'intro':
          label = 'Intro'
          EditorComponent = MarkdownEditor
          break
        case 'content':
          label = 'Content'
          EditorComponent = MarkdownEditor
          break
        case 'type':
          label = 'Type'
          break

        case 'quality':
          label = 'Quality'

          otherInputProps = {
            type: 'number',
            min: 0,
            step: 0.0000000001,
          }
          break

        case 'uri':
          label = 'Uri'
          break

        case 'visibility':
          label = 'Visibility'
          break

        case 'image':
          label = 'Image'

          EditorComponent = ({ value }: { value: string }) => {
            return (
              <>
                <ConceptUploader
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
            {...otherInputProps}
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
    <ConceptEditFormStyled>
      <ConceptEditFormStyled>
        <div>
          <FormProvider {...form}>
            <ConceptEditFormFormStyled onSubmit={onSubmit}>
              <Controller name="name" render={fieldRenderer} />
              <Controller name="type" render={fieldRenderer} />
              <Controller name="image" render={fieldRenderer} />
              <Controller name="quality" render={fieldRenderer} />
              <Controller name="uri" render={fieldRenderer} />
              <Controller name="visibility" render={fieldRenderer} />
              {/* <Controller name="code" render={fieldRenderer} /> */}
              <Controller name="description" render={fieldRenderer} />
              <Controller name="intro" render={fieldRenderer} />
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
            </ConceptEditFormFormStyled>
          </FormProvider>
        </div>
      </ConceptEditFormStyled>
    </ConceptEditFormStyled>
  )
}

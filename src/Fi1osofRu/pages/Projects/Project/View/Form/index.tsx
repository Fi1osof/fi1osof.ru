import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { ProjectEditFormStyled, ProjectEditFormToolbarStyled } from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import {
  ProjectCreateInput,
  ProjectFragment,
  ProjectStatus,
  useCreateProjectMutation,
  UserStatusEnum,
  useUpdateProjectMutation,
} from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { useAppContext } from 'src/components/AppContext'
import { Checkbox } from 'src/ui-kit/controls/Checkbox'
import { FileUploader, FileUploaderProps } from 'src/components/FileUploader'

const MarkdownEditor = dynamic(
  () => import('src/components/Markdown/Editor').then((r) => r.MarkdownEditor),
  {
    ssr: false,
  },
)

type FormData = ProjectCreateInput

function getDefaultValues(project: ProjectEditFormProps['project']): FormData {
  return {
    name: project?.name ?? '',
    description: project?.description ?? '',
    intro: project?.intro ?? '',
    content: project?.content ?? '',
    image: project?.image ?? '',
    commercial: project?.commercial ?? false,
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  intro: yup.string(),
  content: yup.string(),
  image: yup.string(),
  commercial: yup.boolean().required(),
  status: yup.mixed<ProjectStatus>(),
})

type ProjectEditFormProps = {
  project: ProjectFragment | undefined
  cancelHandler: (() => void) | undefined
}

export const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  project,
  cancelHandler,
}) => {
  const { user: currentUser } = useAppContext()

  const { addMessage } = useSnackbar() || {}

  const router = useRouter()

  const [createProjectMutation, { loading: loadingCreateProject }] =
    useCreateProjectMutation()
  const [updateProjectMutation, { loading: loadingUpdateProject }] =
    useUpdateProjectMutation()

  const loading = loadingCreateProject || loadingUpdateProject

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(project),
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
        .then(async (reason) => {
          if (reason === true) {
            const { ...other } = form.getValues()

            const request = project
              ? updateProjectMutation({
                  variables: {
                    data: {
                      ...other,
                    },
                    where: {
                      id: project.id,
                    },
                  },
                })
              : createProjectMutation({
                  variables: {
                    data: {
                      ...other,
                    },
                  },
                })

            request
              .then((r) => {
                const project = r.data?.response

                if (project) {
                  addMessage?.('Success', {
                    variant: 'success',
                  })

                  cancelHandler?.()

                  router.push(`/projects/${project.id}`)
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
      createProjectMutation,
      form,
      project,
      router,
      updateProjectMutation,
      cancelHandler,
    ],
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
      'content' | 'description' | 'name' | 'intro' | 'image'
    >['render']
  >(
    ({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
      let label: string
      const helperText = undefined
      let EditorComponent:
        | typeof TextField
        | React.FC<{
            value: string
          }>
        | typeof MarkdownEditor = TextField

      switch (name) {
        case 'name':
          label = 'Name'
          break
        case 'description':
          label = 'Description'
          break
        case 'intro':
          label = 'Intro'
          EditorComponent = MarkdownEditor
          break
        case 'content':
          label = 'Content'
          EditorComponent = MarkdownEditor
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
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
          />
        </FormControl>
      )
    },
    [onChangeImage],
  )

  const isActive = currentUser && currentUser.status === UserStatusEnum.ACTIVE

  return (
    <FormProvider {...form}>
      <ProjectEditFormStyled onSubmit={onSubmit}>
        <Controller name="name" render={fieldRenderer} />
        <Controller name="description" render={fieldRenderer} />
        <Controller name="intro" render={fieldRenderer} />
        <Controller name="content" render={fieldRenderer} />
        <Controller name="image" render={fieldRenderer} />

        <Controller
          name="commercial"
          // eslint-disable-next-line react/jsx-no-bind
          render={({ field: { value, onChange } }) => (
            <FormControl label="Commercial">
              <Checkbox checked={!!value} onChange={onChange} label="" />
            </FormControl>
          )}
        />

        <ProjectEditFormToolbarStyled>
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
            disabled={!isActive || loading}
          >
            Save
          </Button>
        </ProjectEditFormToolbarStyled>
      </ProjectEditFormStyled>
    </FormProvider>
  )
}

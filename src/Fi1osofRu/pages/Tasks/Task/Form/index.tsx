import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { TaskEditFormStyled, TaskEditFormToolbarStyled } from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import {
  TaskCreateInput,
  TaskFragment,
  useCreateTaskMutation,
  UserStatusEnum,
  useUpdateTaskMutation,
} from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { useAppContext } from 'src/components/AppContext'

const MarkdownEditor = dynamic(
  () => import('src/components/Markdown/Editor').then((r) => r.MarkdownEditor),
  {
    ssr: false,
  },
)

type FormData = Omit<TaskCreateInput, 'parentId'>

function getDefaultValues(
  task: TaskEditFormProps['task'],
  projectId: string | null | undefined,
): FormData {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    content: task?.content ?? '',
    projectId: task?.projectId ?? projectId,
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  content: yup.string(),
  assigneeId: yup.string(),
  startDatePlaning: yup.date(),
  endDatePlaning: yup.date(),
  projectId: yup.string(),
})

type TaskEditFormProps = {
  task: TaskFragment | undefined
  parentId: string | null | undefined
  cancelHandler: (() => void) | undefined
  projectId: string | null | undefined
}

export const TaskEditFormFi1osofRu: React.FC<TaskEditFormProps> = ({
  task,
  cancelHandler,
  parentId,
  projectId,
}) => {
  const { user: currentUser } = useAppContext()

  const { addMessage } = useSnackbar() || {}

  const router = useRouter()

  const [createTaskMutation, { loading: loadingCreateTask }] =
    useCreateTaskMutation()
  const [updateTaskMutation, { loading: loadingUpdateTask }] =
    useUpdateTaskMutation()

  const loading = loadingCreateTask || loadingUpdateTask

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(task, projectId),
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

            const request = task
              ? updateTaskMutation({
                  variables: {
                    data: {
                      ...other,
                    },
                    where: {
                      id: task.id,
                    },
                  },
                })
              : createTaskMutation({
                  variables: {
                    data: {
                      ...other,
                      parentId,
                    },
                  },
                })

            request
              .then((r) => {
                const task = r.data?.response

                if (task) {
                  addMessage?.('Success', {
                    variant: 'success',
                  })

                  cancelHandler?.()

                  router.push(`/tasks/${task.id}`)
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
      createTaskMutation,
      form,
      task,
      router,
      updateTaskMutation,
      cancelHandler,
      parentId,
    ],
  )

  const fieldRenderer = useCallback<
    ControllerProps<
      FormData,
      'content' | 'description' | 'title' | 'projectId'
    >['render']
  >(({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
    let label: string
    const helperText = undefined
    let EditorComponent: typeof TextField | typeof MarkdownEditor = TextField

    switch (name) {
      case 'projectId':
        label = 'Проект'
        break
      case 'title':
        label = 'Название'
        break
      case 'description':
        label = 'Описание'
        EditorComponent = MarkdownEditor
        break
      case 'content':
        label = 'Контент'
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

  const isActive = currentUser && currentUser.status === UserStatusEnum.ACTIVE

  return (
    <FormProvider {...form}>
      <TaskEditFormStyled onSubmit={onSubmit}>
        <Controller name="projectId" render={fieldRenderer} />
        <Controller name="title" render={fieldRenderer} />
        <Controller name="description" render={fieldRenderer} />
        <Controller name="content" render={fieldRenderer} />

        <TaskEditFormToolbarStyled>
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
        </TaskEditFormToolbarStyled>
      </TaskEditFormStyled>
    </FormProvider>
  )
}

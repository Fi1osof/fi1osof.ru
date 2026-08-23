import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { WorkLogFormStyled, WorkLogFormToolbarStyled } from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  TaskWorkLogFragment,
  TaskWorkLogsDocument,
  useCreateTaskWorkLogMutation,
  UserStatusEnum,
  useUpdateTaskWorkLogMutation,
} from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
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

type FormData = {
  content: string
}

function getDefaultValues(workLog: WorkLogFormProps['workLog']): FormData {
  return {
    content: workLog?.content ?? '',
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  content: yup.string().required(),
})

type WorkLogFormProps = {
  workLog: TaskWorkLogFragment | undefined
  taskId: string
  cancelHandler: (() => void) | undefined
  onSuccess?: () => void
}

export const WorkLogForm: React.FC<WorkLogFormProps> = ({
  workLog,
  taskId,
  cancelHandler,
  onSuccess,
}) => {
  const { user: currentUser } = useAppContext()

  const { addMessage } = useSnackbar() || {}

  const [createWorkLogMutation, { loading: loadingCreate }] =
    useCreateTaskWorkLogMutation({
      refetchQueries: [TaskWorkLogsDocument],
    })
  const [updateWorkLogMutation, { loading: loadingUpdate }] =
    useUpdateTaskWorkLogMutation({
      refetchQueries: [TaskWorkLogsDocument],
    })

  const loading = loadingCreate || loadingUpdate

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(workLog),
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
            const { content } = form.getValues()

            const request = workLog
              ? updateWorkLogMutation({
                  variables: {
                    data: { content },
                    where: { id: workLog.id },
                  },
                })
              : createWorkLogMutation({
                  variables: {
                    data: {
                      content,
                      taskId,
                    },
                  },
                })

            request
              .then((r) => {
                const result = r.data?.response

                if (result) {
                  addMessage?.('Success', {
                    variant: 'success',
                  })

                  form.reset()
                  cancelHandler?.()
                  onSuccess?.()
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
      createWorkLogMutation,
      form,
      workLog,
      updateWorkLogMutation,
      cancelHandler,
      taskId,
      onSuccess,
    ],
  )

  const fieldRenderer = useCallback<
    ControllerProps<FormData, 'content'>['render']
  >(
    ({
      field: { name, value, onChange, onBlur: _onBlur },
      fieldState: { error },
    }) => {
      let label: string
      const helperText = undefined
      const EditorComponent = MarkdownEditor

      switch (name) {
        case 'content':
          label = 'Content'
          break
      }

      return (
        <FormControl
          label={label}
          helperText={error ? error.message : helperText}
          error={!!error}
        >
          <EditorComponent value={value || ''} onChange={onChange} />
        </FormControl>
      )
    },
    [],
  )

  const isActive = currentUser && currentUser.status === UserStatusEnum.ACTIVE

  return (
    <FormProvider {...form}>
      <WorkLogFormStyled onSubmit={onSubmit}>
        <Controller name="content" render={fieldRenderer} />

        <WorkLogFormToolbarStyled>
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
        </WorkLogFormToolbarStyled>
      </WorkLogFormStyled>
    </FormProvider>
  )
}

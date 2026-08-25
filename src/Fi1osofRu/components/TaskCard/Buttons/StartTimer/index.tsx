import { useCallback } from 'react'
import { useCreateTimerMutation } from 'src/gql/generated'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { useSnackbar } from 'src/ui-kit/Snackbar'

type TaskStartTimerProps = {
  taskId: string
}

export const TaskStartTimer: React.FC<TaskStartTimerProps> = ({ taskId }) => {
  const { addMessage } = useSnackbar() || {}

  const [createMutation, { client }] = useCreateTimerMutation()

  const onClickStartTimer = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      const value = event.currentTarget.value

      if (value) {
        createMutation({
          variables: {
            data: {
              taskId: value,
            },
          },
        })
          .then((r) => {
            if (r.data?.response) {
              client.resetStore().catch(console.error)
            }
          })
          .catch((error) => {
            addMessage?.(
              (error as Error).message || 'Ошибка выполнения запроса',
              {
                variant: 'error',
              },
            )
          })
      }
    },
    [addMessage, client, createMutation],
  )

  return (
    <Button
      onClick={onClickStartTimer}
      variant={ComponentVariant.DEFAULT}
      value={taskId}
    >
      Запустить таймер
    </Button>
  )
}

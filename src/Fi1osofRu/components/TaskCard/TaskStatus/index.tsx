import React, { useCallback, useMemo } from 'react'
import { TaskStatusBadge } from 'src/components/TaskStatusBadge'
import { TaskStatusEnum, useUpdateTaskMutation } from 'src/gql/generated'
import { useBoolean } from 'src/hooks/useBoolean'
import { Select, SelectOption } from 'src/ui-kit/controls/Select'
import { Popover } from 'src/ui-kit/Popover'
import { TaskCardStatusStyled } from './styles'
import { isTaskStatus } from './helpers/isTaskStatus'
import { useSnackbar } from 'src/ui-kit/Snackbar'

type TaskCardStatusProps = {
  taskId: string
  status: TaskStatusEnum
  canEdit: boolean
}

export const TaskCardStatus: React.FC<TaskCardStatusProps> = ({
  taskId,
  status,
  canEdit,
}) => {
  const { addMessage } = useSnackbar() || {}

  const [inEditModeStatus, inEditModeStatusOn, inEditModeStatusOff] =
    useBoolean()

  const [updateMutations] = useUpdateTaskMutation()

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const value = event.currentTarget.value

      if (!isTaskStatus(value)) {
        console.error(`Unknown value "${value}"`)

        return
      }

      updateMutations({
        variables: {
          where: {
            id: taskId,
          },
          data: {
            status: value,
          },
        },
      })
        .then((r) => {
          if (r.data?.response) {
            inEditModeStatusOff()
          } else {
            addMessage?.('Can not update status', {
              variant: 'error',
            })
          }
        })
        .catch((error) => {
          addMessage?.(error, {
            variant: 'error',
          })
        })
    },
    [addMessage, inEditModeStatusOff, taskId, updateMutations],
  )

  const { options } = useMemo(() => {
    const options: SelectOption[] = Object.values(
      TaskStatusEnum,
    ).map<SelectOption>((n) => {
      return {
        value: n,
        label: n,
      }
    })

    return { options }
  }, [])

  return (
    <TaskCardStatusStyled>
      <Popover
        item={<Select options={options} onChange={onChange} value={status} />}
        opened={inEditModeStatus}
        onCloseHandler={inEditModeStatusOff}
      >
        <TaskStatusBadge
          status={status}
          onClick={inEditModeStatusOn}
          disabled={!canEdit}
        />
      </Popover>
    </TaskCardStatusStyled>
  )
}

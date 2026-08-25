import { TaskFragment } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import {
  TaskCardStyled,
  TaskCardTitle,
  TaskCardMeta,
  TaskCardDescription,
  TaskCardToolbar,
} from './styles'
import Link from 'next/link'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'
import { TaskCardFullView } from './Full'
import React from 'react'
import { TaskCardStatus } from './TaskStatus'
import { TaskStartTimer } from './Buttons/StartTimer'
import { useAppContext } from 'src/components/AppContext'
import { TaskEditFormFi1osofRu } from 'src/Fi1osofRu/pages/Tasks/Task/Form'

type TaskCardProps = {
  task: TaskFragment
  variant: 'list' | 'full'
  titlePrefix?: string
}

export const TaskCardFi1osofRu: React.FC<TaskCardProps> = ({
  task,
  variant,
  titlePrefix,
}) => {
  const { user: currentUser } = useAppContext()
  const [inEditMode, startEditing, stopEditing] = useBoolean()

  const canEdit =
    currentUser?.sudo === true ||
    (currentUser && task.createdById === currentUser.id && variant === 'full')
      ? true
      : false

  // const {} = useMemo(() => {
  //   if (!canEdit) {
  //     return
  //   }

  //   const onClickStatusButton: React.MouseEventHandler<HTMLButtonElement> = (event) => {
  //     event.preventDefault()
  //     event.stopPropagation()

  //   }

  //   return {

  //   }
  // }, [])

  if (inEditMode) {
    return (
      <TaskEditFormFi1osofRu
        task={task}
        cancelHandler={stopEditing}
        parentId={undefined}
        projectId={task.projectId}
      />
    )
  }

  return (
    <TaskCardStyled>
      <TaskCardToolbar>
        <TaskCardTitle>
          {titlePrefix}{' '}
          {variant === 'list' ? (
            <Link href={`/tasks/${task.id}`}>{task.title}</Link>
          ) : (
            task.title
          )}
        </TaskCardTitle>

        {canEdit && (
          <>
            <TaskStartTimer taskId={task.id} />
            <Button onClick={startEditing}>Редактировать</Button>
          </>
        )}
      </TaskCardToolbar>

      <TaskCardStatus canEdit={canEdit} status={task.status} taskId={task.id} />

      <TaskCardMeta>
        <span className="date">
          <FormattedDate value={task.createdAt} format="dateShort" />
        </span>

        {task.Project && (
          <Link href={`/projects/${task.Project.id}`}>{task.Project.name}</Link>
        )}
      </TaskCardMeta>

      {task.description && (
        <TaskCardDescription>{task.description}</TaskCardDescription>
      )}

      {variant === 'full' && (
        <TaskCardFullView task={task} currentUser={currentUser} />
      )}
    </TaskCardStyled>
  )
}

import {
  SortOrder,
  TaskFragment,
  useTaskWorkLogsQuery,
} from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import {
  TaskCardStyled,
  TaskCardTitle,
  TaskCardStatus,
  TaskCardMeta,
  TaskCardDescription,
} from './styles'
import { TaskStatusBadge } from '../TaskStatusBadge'
import Link from 'next/link'
import { Markdown } from '../Markdown'
import { WorkLogCard } from '../WorkLogCard'

type TaskCardProps = {
  task: TaskFragment
  variant?: 'list' | 'full'
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  variant = 'list',
}) => {
  const workLogsResponse = useTaskWorkLogsQuery({
    variables: {
      where: {
        taskId: task.id,
      },
      orderBy: {
        createdAt: SortOrder.ASC,
      },
    },
    skip: !task.id || variant !== 'full',
  })

  return (
    <TaskCardStyled>
      <TaskCardTitle>
        {variant === 'list' ? (
          <Link href={`/tasks/${task.id}`}>{task.title}</Link>
        ) : (
          task.title
        )}
      </TaskCardTitle>

      <TaskCardStatus>
        {task.status && <TaskStatusBadge status={task.status} />}
      </TaskCardStatus>

      <TaskCardMeta>
        {task.createdAt && (
          <span className="date">
            <FormattedDate value={task.createdAt} format="dateShort" />
          </span>
        )}
      </TaskCardMeta>

      {task.description && (
        <TaskCardDescription>{task.description}</TaskCardDescription>
      )}

      {variant === 'full' && (
        <>
          {task.content && <Markdown>{task.content}</Markdown>}

          {workLogsResponse.data?.response?.map((n) => (
            <WorkLogCard key={n.id} workLog={n} variant="list" />
          ))}
        </>
      )}
    </TaskCardStyled>
  )
}

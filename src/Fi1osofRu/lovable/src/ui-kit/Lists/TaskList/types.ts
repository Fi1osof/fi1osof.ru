import type { TaskCardProps } from '../../Cards/TaskCard/types'

export type TaskListItem = TaskCardProps & { id: string }

export interface TaskListProps {
  items: TaskListItem[]
  // onOpen?: (href: string) => void
}

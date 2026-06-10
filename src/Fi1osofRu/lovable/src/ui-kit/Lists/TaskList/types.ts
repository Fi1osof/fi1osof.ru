import type { TaskCardProps } from '../../Cards/TaskCard/types'
export interface TaskListProps {
  items: (TaskCardProps & { id: string })[]
  // onOpen?: (href: string) => void
}

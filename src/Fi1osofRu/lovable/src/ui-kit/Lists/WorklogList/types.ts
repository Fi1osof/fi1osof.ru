import type { WorklogCardProps } from '../../Cards/WorklogCard/types'
export interface WorklogListProps {
  items: (WorklogCardProps & { id: string })[]
  onOpen?: (href: string) => void
}

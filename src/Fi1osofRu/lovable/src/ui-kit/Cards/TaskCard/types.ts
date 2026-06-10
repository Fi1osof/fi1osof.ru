import { Task } from '../../../mocks/tasks'
// import type { ActivityKind } from '../../Status/ActivityIndicator/types'
// export interface TaskCardProps {
//   title: string
//   problem: string
//   status: ActivityKind
//   projectName?: string
//   worklogCount?: number
//   href: string
//   // onOpen?: (href: string) => void
// }
export interface TaskCardProps {
  title: Task['title']
  problem: Task['problem']
  status: Task['status']
  projectName?: string
  worklogCount?: number
  href: string
  // onOpen?: (href: string) => void
}

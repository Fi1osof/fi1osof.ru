import { PageProps } from 'src/components/pages/_App/interfaces'
import { TaskStatusEnum } from 'src/gql/generated'

export type TasksPageProps = PageProps & {
  selectedStatus: TaskStatusEnum | null
  page: number
  projectId: string | undefined
}

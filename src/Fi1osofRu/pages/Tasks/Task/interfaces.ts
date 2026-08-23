import { PageProps } from 'src/components/pages/_App/interfaces'

export type TaskPageProps = PageProps & {
  taskId: string | undefined
}

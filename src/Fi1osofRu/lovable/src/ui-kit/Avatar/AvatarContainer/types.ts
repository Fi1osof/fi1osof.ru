export interface AvatarContainerProps {
  currentEntity?: {
    kind: 'project' | 'task' | 'topic'
    id: string
    title: string
  } | null
}

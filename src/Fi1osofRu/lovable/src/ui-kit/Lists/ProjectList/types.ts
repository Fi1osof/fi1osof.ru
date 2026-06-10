import type { ProjectCardProps } from '../../Cards/ProjectCard/types'
export interface ProjectListProps {
  items: (ProjectCardProps & { id: string })[]
  onOpen?: (href: string) => void
}

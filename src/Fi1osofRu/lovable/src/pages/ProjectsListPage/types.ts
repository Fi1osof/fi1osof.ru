import type { Project } from '../../mocks/projects'

export interface ProjectsListPageProps {
  projects: Project[]
  hrefForProject: (slug: string) => string
  onOpen: (href: string) => void
}

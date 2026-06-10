import type { Project } from '../../mocks/projects'
import type { Task } from '../../mocks/tasks'
import type { Topic } from '../../mocks/topics'

export interface ProjectPageProps {
  project: Project
  tasks: Task[]
  topics: Topic[]
  allProjects: Project[]
  hrefForProject: (slug: string) => string
  hrefForTask: (slug: string) => string
  hrefForTopic: (slug: string) => string
  hrefForProjectsList: () => string
  // onOpen: (href: string) => void;
}

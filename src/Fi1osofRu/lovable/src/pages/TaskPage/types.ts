import type { Project } from '../../mocks/projects'
import type { Task } from '../../mocks/tasks'

export interface TaskPageProps {
  task: Task
  project?: Project
  relatedTasks: Task[]
  hrefForTask: (slug: string) => string
  hrefForProject: (slug: string) => string
  hrefForProjectsList: () => string
  // onOpen: (href: string) => void;
}

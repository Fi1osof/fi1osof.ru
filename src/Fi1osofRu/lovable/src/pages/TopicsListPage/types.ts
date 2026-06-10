import type { Topic } from '../../mocks/topics'
import type { Project } from '../../mocks/projects'
import type { Task } from '../../mocks/tasks'

export interface TopicsListPageProps {
  topics: Topic[]
  projects: Project[]
  tasks: Task[]
  hrefForTopic: (slug: string) => string
  hrefForProject: (slug: string) => string
  hrefForTask: (slug: string) => string
  // onOpen: (href: string) => void;
}

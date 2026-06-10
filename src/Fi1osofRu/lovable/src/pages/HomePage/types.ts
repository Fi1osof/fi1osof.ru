import type { Project } from '../../mocks/projects'
import type { Task } from '../../mocks/tasks'
import type { Worklog } from '../../mocks/tasks'
import type { Topic } from '../../mocks/topics'
import type { Availability } from '../../mocks/availability'

export type HomePageWorkLog = Worklog & { taskTitle: string; taskHref: string }

export interface HomePageProps {
  projects: Project[]
  tasks: Task[]
  worklogs: HomePageWorkLog[]
  topics: Topic[]
  availability: Availability
  // hrefForProject: (slug: string) => string
  // hrefForTask: (slug: string) => string
  // hrefForTopic: (slug: string) => string
  // onOpen: (href: string) => void;
}

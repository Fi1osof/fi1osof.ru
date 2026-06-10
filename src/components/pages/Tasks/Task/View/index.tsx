import { useAppContext } from 'src/components/AppContext'
import { TaskCard } from 'src/components/TaskCard'
import { TaskFragment } from 'src/gql/generated'
import { TaskWorlLogs } from './WorkLogs'
import { TaskPageViewStyled } from './styles'

type TaskPageViewProps = {
  task: TaskFragment
}

export const TaskPageView: React.FC<TaskPageViewProps> = ({ task }) => {
  const { user: currentUser } = useAppContext()

  return (
    <TaskPageViewStyled size="wide">
      <TaskCard task={task} variant="full" />

      <TaskWorlLogs task={task} currentUser={currentUser} />
    </TaskPageViewStyled>
  )
}

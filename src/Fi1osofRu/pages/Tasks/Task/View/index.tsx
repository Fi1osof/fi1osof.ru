import { useAppContext } from 'src/components/AppContext'
import { TaskCard } from 'src/components/TaskCard'
import { TaskQuery } from 'src/gql/generated'
import { TaskWorlLogs } from './WorkLogs'
import { TaskPageViewStyled } from './styles'
import { H1Styled } from 'src/Fi1osofRu/styles'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { taskViewLexicon } from './lexicon'

type TaskPageViewProps = {
  task: NonNullable<TaskQuery['response']>
}

export const TaskPageView: React.FC<TaskPageViewProps> = ({ task }) => {
  const { user: currentUser } = useAppContext()
  const { t } = useLexicon(taskViewLexicon)

  const { WorkLogs } = task

  return (
    <TaskPageViewStyled size="wide">
      <H1Styled>
        {t('title')} {task.title}
      </H1Styled>

      <TaskCard task={task} variant="full" />

      <TaskWorlLogs
        task={task}
        workLogs={WorkLogs ?? []}
        currentUser={currentUser}
      />
    </TaskPageViewStyled>
  )
}

import { AppContextValue } from 'src/components/AppContext'
import { Markdown } from 'src/components/Markdown'
import { TaskFragment } from 'src/gql/generated'

type TaskCardFullViewProps = {
  task: TaskFragment
  currentUser: AppContextValue['user']
}

export const TaskCardFullView: React.FC<TaskCardFullViewProps> = ({ task }) => {
  return (
    <>
      {task.content && <Markdown>{task.content}</Markdown>}

      {/* {currentUser && (
        <WorkLogForm
          workLog={undefined}
          taskId={task.id}
          cancelHandler={undefined}
        />
      )} */}
    </>
  )
}

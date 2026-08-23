import {
  SortOrder,
  TaskFragment,
  useTaskWorkLogsQuery,
} from 'src/gql/generated'

import { WorkLogForm } from 'src/components/pages/WorkLogs/WorkLog/Form'

import { WorkLogCard } from 'src/components/WorkLogCard'
import { AppContextValue } from 'src/components/AppContext'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'

type TaskWorlLogsProps = {
  task: TaskFragment
  currentUser: AppContextValue['user']
}

export const TaskWorlLogs: React.FC<TaskWorlLogsProps> = ({
  task,
  currentUser,
}) => {
  const [inEditModeWorkLog, inEditModeWorkLogOn, inEditModeWorkLogOff] =
    useBoolean()

  const workLogsResponse = useTaskWorkLogsQuery({
    variables: {
      where: {
        taskId: task.id,
      },
      orderBy: {
        createdAt: SortOrder.ASC,
      },
    },
  })

  return (
    <>
      {workLogsResponse.data?.response?.map((n) => (
        <WorkLogCard key={n.id} workLog={n} variant="list" />
      ))}

      {currentUser && inEditModeWorkLog ? (
        <WorkLogForm
          workLog={undefined}
          taskId={task.id}
          cancelHandler={inEditModeWorkLogOff}
          onSuccess={inEditModeWorkLogOff}
        />
      ) : (
        <div>
          <Button type="submit" onClick={inEditModeWorkLogOn}>
            Create workLog
          </Button>
        </div>
      )}
    </>
  )
}

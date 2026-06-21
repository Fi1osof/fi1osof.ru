import { TaskQuery, TaskWorkLogFragment } from 'src/gql/generated'

import { WorkLogForm } from 'src/components/pages/WorkLogs/WorkLog/Form'

import { WorkLogCard } from 'src/components/WorkLogCard'
import { AppContextValue } from 'src/components/AppContext'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'
import { H2Styled } from 'src/Fi1osofRu/styles'

type TaskWorlLogsProps = {
  task: NonNullable<TaskQuery['response']>
  currentUser: AppContextValue['user']
  workLogs: TaskWorkLogFragment[]
}

export const TaskWorlLogs: React.FC<TaskWorlLogsProps> = ({
  task,
  currentUser,
  workLogs,
}) => {
  const [inEditModeWorkLog, inEditModeWorkLogOn, inEditModeWorkLogOff] =
    useBoolean()

  return (
    <>
      {workLogs.length > 0 && (
        <>
          <H2Styled>Ворклоги</H2Styled>
          {workLogs.map((n) => (
            <WorkLogCard key={n.id} workLog={n} variant="list" />
          ))}
        </>
      )}

      {currentUser && (
        <>
          {inEditModeWorkLog ? (
            <WorkLogForm
              workLog={undefined}
              taskId={task.id}
              cancelHandler={inEditModeWorkLogOff}
              onSuccess={inEditModeWorkLogOff}
            />
          ) : (
            <div>
              <Button type="submit" onClick={inEditModeWorkLogOn}>
                Создать ворклог
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}

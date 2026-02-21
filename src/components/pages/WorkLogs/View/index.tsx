import React from 'react'
import { TaskWorkLogFragment } from 'src/gql/generated'
import { Pagination } from 'src/components/Pagination'
import { WorkLogCard } from 'src/components/WorkLogCard'
import { WorkLogsViewStyled, WorkLogsViewListStyled } from './styles'

type WorkLogsViewProps = {
  workLogs: TaskWorkLogFragment[]
  loading?: boolean
  currentPage: number
  totalPages: number
}

export const WorkLogsView: React.FC<WorkLogsViewProps> = ({
  workLogs,
  currentPage,
  totalPages,
}) => {
  return (
    <WorkLogsViewStyled>
      <h1>Work Logs</h1>

      <WorkLogsViewListStyled>
        {workLogs.map((workLog) => (
          <WorkLogCard key={workLog.id} workLog={workLog} />
        ))}
      </WorkLogsViewListStyled>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </WorkLogsViewStyled>
  )
}

import React from 'react'
import { MindLogFragment } from 'src/gql/generated'
import { Pagination } from 'src/components/Pagination'
import { MindLogCard } from 'src/components/MindLogCard'
import { MindLogsViewStyled, MindLogsViewListStyled } from './styles'

type MindLogsViewProps = {
  mindLogs: MindLogFragment[]
  loading?: boolean
  currentPage: number
  totalPages: number
}

export const MindLogsView: React.FC<MindLogsViewProps> = ({
  mindLogs,
  currentPage,
  totalPages,
}) => {
  return (
    <MindLogsViewStyled>
      <h1>Mind Logs</h1>

      <MindLogsViewListStyled>
        {mindLogs.map((n) => (
          <MindLogCard key={n.id} mindLog={n} />
        ))}
      </MindLogsViewListStyled>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </MindLogsViewStyled>
  )
}

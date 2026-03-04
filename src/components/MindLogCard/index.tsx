import React from 'react'
import { MindLogFragment } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { MindLogCardStyled } from './styles'
import { Markdown } from '../Markdown'
import Link from 'next/link'

type MindLogCardProps = {
  mindLog: MindLogFragment
}

export const MindLogCard: React.FC<MindLogCardProps> = ({ mindLog }) => {
  return (
    <MindLogCardStyled>
      <Link key={mindLog.id} href={`/mind-logs/${mindLog.id}`}>
        <strong>{mindLog.type}</strong>
        <span>
          <FormattedDate value={mindLog.createdAt} format="dateTimeMedium" />
        </span>
      </Link>
      <Markdown>{mindLog.data}</Markdown>
    </MindLogCardStyled>
  )
}

import React from 'react'
import { TaskWorkLogFragment } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { WorkLogCardStyled, WorkLogCardMeta } from './styles'
import Link from 'next/link'
import { Markdown } from '../Markdown'

type WorkLogCardProps = {
  workLog: TaskWorkLogFragment
  variant?: 'list' | 'full'
}

export const WorkLogCard: React.FC<WorkLogCardProps> = ({
  workLog,
  variant = 'list',
}) => {
  return (
    <WorkLogCardStyled>
      <WorkLogCardMeta>
        {variant === 'list' && workLog.id ? (
          <Link href={`/work-logs/${workLog.id}`}>
            <FormattedDate value={workLog.createdAt} format="dateTimeMedium" />
          </Link>
        ) : (
          <FormattedDate value={workLog.createdAt} format="dateTimeMedium" />
        )}
      </WorkLogCardMeta>

      {workLog.content && <Markdown>{workLog.content}</Markdown>}
    </WorkLogCardStyled>
  )
}

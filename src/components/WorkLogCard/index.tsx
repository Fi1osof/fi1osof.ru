import React from 'react'
import { TaskWorkLogFragment } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import {
  WorkLogCardStyled,
  WorkLogCardMeta,
  WorkLogCardHeaderStyled,
} from './styles'
import Link from 'next/link'
import { Markdown } from '../Markdown'
import { WorkLogTranslateButton } from './TranslateButton'

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
        {variant === 'list' ? (
          <Link href={`/worklogs/${workLog.id}`}>
            <FormattedDate value={workLog.createdAt} format="dateTimeMedium" />
          </Link>
        ) : (
          <WorkLogCardHeaderStyled>
            <FormattedDate value={workLog.createdAt} format="dateTimeMedium" />
            <WorkLogTranslateButton workLog={workLog} />
          </WorkLogCardHeaderStyled>
        )}
      </WorkLogCardMeta>

      {workLog.content && <Markdown>{workLog.content}</Markdown>}
    </WorkLogCardStyled>
  )
}

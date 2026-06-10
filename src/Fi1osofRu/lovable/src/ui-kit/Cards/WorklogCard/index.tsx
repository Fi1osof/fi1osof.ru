import type React from 'react'
import { DualDate } from '../../Meta/DualDate'
import {
  WorklogCardStyled,
  WorklogCardHeadStyled,
  WorklogCardTaskStyled,
  WorklogCardBodyStyled,
} from './styles'
import type { WorklogCardProps } from './types'

export const WorklogCard: React.FC<WorklogCardProps> = ({
  taskTitle,
  body,
  eventAt,
  publishedAt,
  href,
  // onOpen,
  ...other
}) => (
  <WorklogCardStyled {...other}>
    <WorklogCardHeadStyled>
      {taskTitle && (
        <WorklogCardTaskStyled
          href={href}
          // onClick={(e) => {
          //   if (href && onOpen) {
          //     e.preventDefault()
          //     onOpen(href)
          //   }
          // }}
        >
          ↳ {taskTitle}
        </WorklogCardTaskStyled>
      )}
      {publishedAt && (
        <DualDate eventAt={eventAt} publishedAt={publishedAt} compact />
      )}
    </WorklogCardHeadStyled>
    <WorklogCardBodyStyled>{body}</WorklogCardBodyStyled>
  </WorklogCardStyled>
)

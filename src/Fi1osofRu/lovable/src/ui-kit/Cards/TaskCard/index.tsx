import type React from 'react'
import { ActivityIndicator } from '../../Status/ActivityIndicator'
import {
  TaskCardStyled,
  TaskCardRailStyled,
  TaskCardBodyStyled,
  TaskCardTitleStyled,
  TaskCardProblemStyled,
  TaskCardMetaStyled,
  TaskCardAsideStyled,
} from './styles'
import type { TaskCardProps } from './types'

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  problem,
  status,
  projectName,
  worklogCount,
  href,
  // onOpen,
  ...other
}) => (
  <TaskCardStyled
    href={href}
    // onClick={(e) => {
    //   if (onOpen) {
    //     e.preventDefault()
    //     onOpen(href)
    //   }
    // }}
    {...other}
  >
    <TaskCardRailStyled $kind={status} />
    <TaskCardBodyStyled>
      <TaskCardTitleStyled>{title}</TaskCardTitleStyled>
      <TaskCardProblemStyled>{problem}</TaskCardProblemStyled>
      <TaskCardMetaStyled>
        {projectName && <span>проект · {projectName}</span>}
        {typeof worklogCount === 'number' && (
          <span>ворклогов · {worklogCount}</span>
        )}
      </TaskCardMetaStyled>
    </TaskCardBodyStyled>
    <TaskCardAsideStyled>
      <ActivityIndicator kind={status} />
    </TaskCardAsideStyled>
  </TaskCardStyled>
)

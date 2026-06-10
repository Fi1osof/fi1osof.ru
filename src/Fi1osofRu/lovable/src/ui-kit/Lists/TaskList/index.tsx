import type React from 'react'
import { TaskCard } from '../../Cards/TaskCard'
import { TaskListStyled } from './styles'
import type { TaskListProps } from './types'

export const TaskList: React.FC<TaskListProps> = ({ items, ...other }) => (
  <TaskListStyled {...other}>
    {items.map(({ id, ...t }) => (
      <TaskCard key={id} {...t} />
    ))}
  </TaskListStyled>
)

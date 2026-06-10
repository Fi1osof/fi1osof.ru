import type React from 'react'
import { WorklogCard } from '../../Cards/WorklogCard'
import { WorklogListStyled } from './styles'
import type { WorklogListProps } from './types'

export const WorklogList: React.FC<WorklogListProps> = ({
  items,
  ...other
}) => (
  <WorklogListStyled {...other}>
    {items.map(({ id, ...w }) => (
      <WorklogCard key={id} {...w} />
    ))}
  </WorklogListStyled>
)

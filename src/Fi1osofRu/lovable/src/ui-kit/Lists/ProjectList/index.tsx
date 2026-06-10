import type React from 'react'
import { ProjectCard } from '../../Cards/ProjectCard'
import { ProjectListStyled } from './styles'
import type { ProjectListProps } from './types'

export const ProjectList: React.FC<ProjectListProps> = ({
  items,
  ...other
}) => (
  <ProjectListStyled {...other}>
    {items.map(({ id, ...p }) => (
      <ProjectCard key={id} {...p} />
    ))}
  </ProjectListStyled>
)

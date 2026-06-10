import type React from 'react'
import { ActivityIndicator } from '../../Status/ActivityIndicator'
import { Tag } from '../../Meta/Tag'
import {
  ProjectCardStyled,
  ProjectCardImageStyled,
  ProjectCardBodyStyled,
  ProjectCardHeadStyled,
  ProjectCardTitleStyled,
  ProjectCardDescStyled,
  ProjectCardMetaStyled,
} from './styles'
import type { ProjectCardProps } from './types'

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  startedAt,
  focus,
  image,
  href,
  // onOpen,
  ...other
}) => (
  <ProjectCardStyled
    href={href}
    // onClick={(e) => {
    //   if (onOpen) {
    //     e.preventDefault()
    //     onOpen(href)
    //   }
    // }}
    {...other}
  >
    {image && (
      <ProjectCardImageStyled>
        <img src={image} alt="" loading="lazy" />
      </ProjectCardImageStyled>
    )}
    <ProjectCardBodyStyled>
      <ProjectCardHeadStyled>
        <ProjectCardTitleStyled>{title}</ProjectCardTitleStyled>
        {status && <ActivityIndicator kind={status} />}
      </ProjectCardHeadStyled>
      <ProjectCardDescStyled>{description}</ProjectCardDescStyled>
      <ProjectCardMetaStyled>
        <span>с {startedAt}</span>
        {focus?.map((f) => (
          <Tag key={f} tone="neutral">
            {f}
          </Tag>
        ))}
      </ProjectCardMetaStyled>
    </ProjectCardBodyStyled>
  </ProjectCardStyled>
)

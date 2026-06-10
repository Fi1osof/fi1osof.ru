import type React from 'react'
import { DualDate } from '../../Meta/DualDate'
import {
  TopicCardStyled,
  TopicCardTitleStyled,
  TopicCardExcerptStyled,
} from './styles'
import type { TopicCardProps } from './types'

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  excerpt,
  eventAt,
  publishedAt,
  href,
  // onOpen,
  ...other
}) => (
  <TopicCardStyled
    href={href}
    // onClick={(e) => {
    //   if (onOpen) {
    //     e.preventDefault()
    //     onOpen(href)
    //   }
    // }}
    {...other}
  >
    <TopicCardTitleStyled>{title}</TopicCardTitleStyled>
    <TopicCardExcerptStyled>{excerpt}</TopicCardExcerptStyled>
    <DualDate eventAt={eventAt} publishedAt={publishedAt} compact />
  </TopicCardStyled>
)

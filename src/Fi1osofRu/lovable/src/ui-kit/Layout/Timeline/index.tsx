import type React from 'react'
import {
  TimelineStyled,
  TimelineItemStyled,
  TimelineMetaStyled,
  TimelineLabelStyled,
  TimelineContentStyled,
} from './styles'
import type { TimelineProps } from './types'

export const Timeline: React.FC<TimelineProps> = ({ items, ...other }) => (
  <TimelineStyled {...other}>
    {items.map((item) => (
      <TimelineItemStyled key={item.id}>
        <TimelineMetaStyled>
          {item.eventAt && <span>событие · {item.eventAt}</span>}
          {item.publishedAt && <span>опубл. · {item.publishedAt}</span>}
          {item.label && (
            <TimelineLabelStyled>{item.label}</TimelineLabelStyled>
          )}
        </TimelineMetaStyled>
        <TimelineContentStyled>{item.content}</TimelineContentStyled>
      </TimelineItemStyled>
    ))}
  </TimelineStyled>
)

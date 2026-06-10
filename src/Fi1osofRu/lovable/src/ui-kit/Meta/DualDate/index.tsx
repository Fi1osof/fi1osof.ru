import type React from 'react'
import {
  DualDateStyled,
  DualDateRowStyled,
  DualDateLabelStyled,
} from './styles'
import type { DualDateProps } from './types'

export const DualDate: React.FC<DualDateProps> = ({
  eventAt,
  publishedAt,
  compact,
  ...other
}) => (
  <DualDateStyled $compact={compact} {...other}>
    {eventAt && (
      <DualDateRowStyled>
        <DualDateLabelStyled>событие</DualDateLabelStyled>
        <span>{eventAt}</span>
      </DualDateRowStyled>
    )}
    {publishedAt && (
      <DualDateRowStyled>
        <DualDateLabelStyled>опубл.</DualDateLabelStyled>
        <span>{publishedAt}</span>
      </DualDateRowStyled>
    )}
  </DualDateStyled>
)

import type React from 'react'
import { AvailabilityStyled, AvailabilityDotStyled } from './styles'
import type { AvailabilityIndicatorProps } from './types'

const defaultLabel: Record<string, string> = {
  available: 'доступен для новых задач',
  limited: 'ограниченно доступен',
  busy: 'полностью занят',
}

export const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({
  status,
  label,
  ...other
}) => (
  <AvailabilityStyled {...other}>
    <AvailabilityDotStyled $status={status} />
    <span>{label ?? defaultLabel[status]}</span>
  </AvailabilityStyled>
)

import type React from 'react'
import { ActivityStyled } from './styles'
import type { ActivityIndicatorProps } from './types'

const defaultLabel: Record<string, string> = {
  active: 'активно',
  research: 'исследование',
  paused: 'пауза',
  done: 'завершено',
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  kind,
  label,
  ...other
}) => (
  <ActivityStyled $kind={kind} {...other}>
    {label ?? defaultLabel[kind]}
  </ActivityStyled>
)

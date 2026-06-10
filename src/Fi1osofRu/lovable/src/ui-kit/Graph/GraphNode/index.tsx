import type React from 'react'
import { GraphNodeStyled } from './styles'
import type { GraphNodeProps } from './types'

export const GraphNode: React.FC<GraphNodeProps> = ({
  label,
  x,
  y,
  kind = 'topic',
  ...other
}) => (
  <GraphNodeStyled $x={x} $y={y} $kind={kind} {...other}>
    {label}
  </GraphNodeStyled>
)

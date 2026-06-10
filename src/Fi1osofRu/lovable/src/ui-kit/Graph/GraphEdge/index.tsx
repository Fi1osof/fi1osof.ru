import type React from 'react'
import { GraphEdgeStyled } from './styles'
import type { GraphEdgeProps } from './types'

export const GraphEdge: React.FC<GraphEdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  ...other
}) => <GraphEdgeStyled x1={x1} y1={y1} x2={x2} y2={y2} {...other} />

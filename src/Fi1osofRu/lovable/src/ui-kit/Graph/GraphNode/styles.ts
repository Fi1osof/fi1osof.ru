import styled, { css } from 'styled-components'
import type { GraphNodeProps } from './types'

const tone = (k: NonNullable<GraphNodeProps['kind']>) => css`
  ${({ theme }) => {
    switch (k) {
      case 'project':
        return css`
          border-color: ${theme.color.accent};
          color: ${theme.color.accent};
        `
      case 'task':
        return css`
          border-color: ${theme.color.warm};
          color: ${theme.color.warm};
        `
      default:
        return css`
          border-color: ${theme.color.inkMuted};
          color: ${theme.color.inkMuted};
        `
    }
  }}
`

export const GraphNodeStyled = styled.div<{
  $x: number
  $y: number
  $kind: NonNullable<GraphNodeProps['kind']>
}>`
  position: absolute;
  left: ${({ $x }) => `${$x}px`};
  top: ${({ $y }) => `${$y}px`};
  transform: translate(-50%, -50%);
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 4px 8px;
  ${({ $kind }) => tone($kind)}
`

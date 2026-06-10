import styled, { css } from 'styled-components'
import type { ActivityKind } from './types'

const tone = (k: ActivityKind) => css`
  ${({ theme }) => {
    switch (k) {
      case 'active':
        return css`
          color: ${theme.color.accent};
          background: ${theme.color.accentSoft};
        `
      case 'research':
        return css`
          color: ${theme.color.warm};
          background: ${theme.color.warmSoft};
        `
      case 'paused':
        return css`
          color: ${theme.color.inkMuted};
          background: ${theme.color.surfaceMuted};
        `
      case 'done':
        return css`
          color: ${theme.color.success};
          background: #e2efe7;
        `
    }
  }}
`

export const ActivityStyled = styled.span<{ $kind: ActivityKind }>`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ $kind }) => tone($kind)}
`

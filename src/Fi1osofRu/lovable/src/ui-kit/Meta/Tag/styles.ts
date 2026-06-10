import styled, { css } from 'styled-components'
import type { TagProps } from './types'

const tone = (t: NonNullable<TagProps['tone']>) => css`
  ${({ theme }) => {
    switch (t) {
      case 'accent':
        return css`
          background: ${theme.color.accentSoft};
          color: ${theme.color.accent};
        `
      case 'warm':
        return css`
          background: ${theme.color.warmSoft};
          color: ${theme.color.warm};
        `
      case 'success':
        return css`
          background: #e2efe7;
          color: ${theme.color.success};
        `
      case 'warning':
        return css`
          background: #f5eccb;
          color: ${theme.color.warning};
        `
      default:
        return css`
          background: ${theme.color.surfaceMuted};
          color: ${theme.color.inkMuted};
        `
    }
  }}
`

export const TagStyled = styled.span<{ $tone: NonNullable<TagProps['tone']> }>`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ $tone }) => tone($tone)}
`

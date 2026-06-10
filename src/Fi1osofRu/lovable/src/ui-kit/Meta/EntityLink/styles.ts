import styled, { css } from 'styled-components'
import type { EntityLinkProps } from './types'
import Link from 'next/link'

const kindColor = (k: NonNullable<EntityLinkProps['kind']>) => css`
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
      case 'topic':
        return css`
          border-color: ${theme.color.inkMuted};
          color: ${theme.color.inkMuted};
        `
      default:
        return css`
          border-color: ${theme.color.hairline};
          color: ${theme.color.ink};
        `
    }
  }}
`

export const EntityLinkStyled = styled(Link)<{
  $kind: NonNullable<EntityLinkProps['kind']>
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  padding: 2px 6px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  background: ${({ theme }) => theme.color.surface};
  ${({ $kind }) => kindColor($kind)}
  &:hover {
    background: ${({ theme }) => theme.color.surfaceMuted};
  }
`

export const EntityLinkKindStyled = styled.span`
  opacity: 0.6;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

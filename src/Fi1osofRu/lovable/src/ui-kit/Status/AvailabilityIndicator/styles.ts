import styled, { css } from 'styled-components'
import type { AvailabilityStatus } from './types'

const dot = (s: AvailabilityStatus) => css`
  ${({ theme }) => {
    switch (s) {
      case 'available':
        return css`
          background: ${theme.color.success};
        `
      case 'limited':
        return css`
          background: ${theme.color.warning};
        `
      case 'busy':
        return css`
          background: ${theme.color.warm};
        `
    }
  }}
`

export const AvailabilityStyled = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.ink};
`

export const AvailabilityDotStyled = styled.span<{
  $status: AvailabilityStatus
}>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  ${({ $status }) => dot($status)}
`

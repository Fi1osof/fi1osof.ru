import styled, { css } from 'styled-components'

export const ContainerStyled = styled.div<{ $size: 'default' | 'wide' }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space(6)};
  ${({ $size }) =>
    $size === 'wide'
      ? css`
          max-width: 1280px;
        `
      : css`
          max-width: 960px;
        `}
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding: 0 ${({ theme }) => theme.space(4)};
  }
`

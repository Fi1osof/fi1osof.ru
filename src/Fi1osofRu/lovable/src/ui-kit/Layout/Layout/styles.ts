import { minWidth } from 'src/theme/helpers'
import styled, { css } from 'styled-components'

export const LayoutRootBrendNameFullStyled = styled.span``

export const LayoutRootBrendNameStyled = styled.div`
  ${LayoutRootBrendNameFullStyled} {
    display: none;

    ${minWidth.sm(css`
      display: unset;
    `)}
  }
`

export const LayoutRootStyled = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.paper};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`

export const LayoutBodyStyled = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.space(8)} ${theme.space(4)}`};
  max-width: 1260px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding: ${({ theme }) => theme.space(4)};
  }
`

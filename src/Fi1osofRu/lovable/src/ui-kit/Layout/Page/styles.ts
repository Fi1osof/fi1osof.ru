import styled from 'styled-components'

export const PageStyled = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.paper};
  display: flex;
  flex-direction: column;
`

export const PageInnerStyled = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.space(8)} 0 ${({ theme }) => theme.space(16)};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding: ${({ theme }) => theme.space(4)} 0
      ${({ theme }) => theme.space(20)};
  }
`

import styled from 'styled-components'

export const LayoutRootStyled = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.paper};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`

export const LayoutBodyStyled = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.space(8)} 0;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding: ${({ theme }) => theme.space(4)} 0;
  }
`

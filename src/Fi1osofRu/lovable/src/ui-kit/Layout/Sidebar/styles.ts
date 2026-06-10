import styled from 'styled-components'

export const SidebarStyled = styled.div<{ $side: 'left' | 'right' }>`
  display: grid;
  grid-template-columns: ${({ $side }) =>
    $side === 'left' ? '280px 1fr' : '1fr 280px'};
  gap: ${({ theme }) => theme.space(10)};
  @media (max-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space(8)};
  }
`

export const SidebarAsideStyled = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(6)};
`

export const SidebarMainStyled = styled.div`
  min-width: 0;
`

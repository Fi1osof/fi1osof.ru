import Link from 'next/link'
import styled from 'styled-components'

export const HeaderStyled = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
  background: ${({ theme }) => theme.color.paper};
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(120%) blur(6px);
`

export const HeaderInnerStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(6)};
  padding: ${({ theme }) => theme.space(4)} 0;
`

export const HeaderBrandStyled = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  flex: 0 0 auto;
  min-width: 0;
  max-width: 60%;
`

export const HeaderNameStyled = styled.div`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.md};
  }
`

export const HeaderTaglineStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: none;
  }
`

export const HeaderTimerSlotStyled = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  min-width: 0;
  padding: 0 ${({ theme }) => theme.space(3)};
`

export const HeaderNavStyled = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space(5)};
  flex-wrap: nowrap;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: none;
  }
`

export const HeaderLinkStyled = styled(Link)<{ $active?: boolean }>`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ $active, theme }) =>
    $active ? theme.color.accent : theme.color.ink};
  border-bottom: 1px solid
    ${({ $active, theme }) => ($active ? theme.color.accent : 'transparent')};
  padding-bottom: 2px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`

export const BurgerButtonStyled = styled.button<{ $open?: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 22px;
  padding: 4px 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  flex: none;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: flex;
  }
`

export const BurgerLineStyled = styled.span`
  display: block;
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.color.ink};
  border-radius: 1px;
`

export const MobilePanelStyled = styled.div`
  display: none;
  flex-direction: column;
  padding: ${({ theme }) => theme.space(2)} 0 ${({ theme }) => theme.space(4)};
  border-top: 1px solid ${({ theme }) => theme.color.hairline};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: flex;
  }
`

export const MobileLinkStyled = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => theme.space(3)} 0;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ $active, theme }) =>
    $active ? theme.color.accent : theme.color.ink};
  border-bottom: 1px dashed ${({ theme }) => theme.color.hairline};
  text-decoration: none;
`

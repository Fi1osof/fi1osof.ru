import Link from 'next/link'
import styled from 'styled-components'

export const FooterStyled = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.color.hairline};
  background: ${({ theme }) => theme.color.surfaceMuted};
  padding: ${({ theme }) => theme.space(10)} 0 ${({ theme }) => theme.space(8)};
  margin-top: ${({ theme }) => theme.space(16)};
`

export const FooterInnerStyled = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${({ theme }) => theme.space(8)};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space(6)};
  }
`

export const FooterColStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`

export const FooterTitleStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.inkSubtle};
  margin-bottom: ${({ theme }) => theme.space(1)};
`

export const FooterLinkStyled = styled(Link)`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.ink};
  cursor: pointer;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
  display: flex;
  align-items: center;
  gap: 5px;
`

export const FooterMetaStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  line-height: 1.6;
`

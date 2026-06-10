import Link from 'next/link'
import styled from 'styled-components'

export const MenuStyled = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
`

export const MenuItemStyled = styled.li``

export const MenuLinkStyled = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.space(2)} 0;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.ink};
  border-bottom: 1px dashed ${({ theme }) => theme.color.hairline};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`

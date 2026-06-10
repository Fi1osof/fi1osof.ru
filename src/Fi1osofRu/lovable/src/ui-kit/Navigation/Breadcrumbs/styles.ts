import styled from 'styled-components'

export const BreadcrumbsStyled = styled.nav`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
`

export const BreadcrumbsItemStyled = styled.a<{ $clickable?: boolean }>`
  color: inherit;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  &:hover {
    color: ${({ $clickable, theme }) =>
      $clickable ? theme.color.accent : 'inherit'};
  }
`

export const BreadcrumbsSepStyled = styled.span`
  opacity: 0.5;
`

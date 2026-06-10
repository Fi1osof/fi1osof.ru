import Link from 'next/link'
import styled from 'styled-components'

export const TopicCardStyled = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.space(4)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
  cursor: pointer;
  &:hover h3 {
    color: ${({ theme }) => theme.color.accent};
  }
`

export const TopicCardTitleStyled = styled.h3`
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 4px;
  transition: color 120ms ease;
`

export const TopicCardExcerptStyled = styled.p`
  color: ${({ theme }) => theme.color.inkMuted};
  font-size: ${({ theme }) => theme.size.sm};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

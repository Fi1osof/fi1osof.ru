import styled from 'styled-components'

export const WorkLogCardHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const WorkLogCardMeta = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export const WorkLogCardStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`

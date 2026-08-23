import styled from 'styled-components'

export const WorkLogsViewStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

export const WorkLogsViewListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

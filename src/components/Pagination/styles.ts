import styled from 'styled-components'

export const PaginationStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export const PageButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`

export const PageInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

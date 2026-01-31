import styled from 'styled-components'

export const TransactionItemStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
`

export const TransactionInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const TransactionTypeStyled = styled.span<{ $isIncoming: boolean }>`
  font-weight: 500;
  color: ${({ $isIncoming }) => ($isIncoming ? '#28a745' : '#dc3545')};
`

export const TransactionUserStyled = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const TransactionAmountStyled = styled.span<{ $isPositive: boolean }>`
  font-weight: 600;
  color: ${({ $isPositive }) => ($isPositive ? '#28a745' : '#dc3545')};
`

import React from 'react'
import { TransactionType } from 'src/gql/generated'
import { TransactionTypeStyled } from '../styles'

interface TransactionTypeProps {
  type: TransactionType
  title?: string | null
  isIncoming: boolean
}

const getTransactionTypeName = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.TRANSFERIN:
      return 'Пополнение'
    case TransactionType.TRANSFEROUT:
      return 'Перевод'
    case TransactionType.TOPUP:
      return 'Пополнение баланса'
  }
}

export const TransactionTypeComponent: React.FC<TransactionTypeProps> = ({
  type,
  title,
  isIncoming,
}) => {
  const typeName = getTransactionTypeName(type)

  return (
    <TransactionTypeStyled $isIncoming={isIncoming}>
      {typeName}
      {title && `: ${title}`}
    </TransactionTypeStyled>
  )
}

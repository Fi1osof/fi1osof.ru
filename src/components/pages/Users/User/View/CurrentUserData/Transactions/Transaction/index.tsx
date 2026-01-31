import React from 'react'
import {
  TransactionFragment,
  TransactionType,
  UserFragment,
} from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import {
  TransactionItemStyled,
  TransactionInfoStyled,
  TransactionUserStyled,
  TransactionAmountStyled,
} from './styles'
import { TransactionTypeComponent } from './TransactionType'
import { UserLink } from 'src/components/Link/User'

const getCounterparty = (
  node: TransactionFragment,
): React.ReactNode | undefined => {
  let user: UserFragment | undefined

  if (node.type === TransactionType.TRANSFERIN && node.Parent?.User) {
    user = node.Parent?.User
  } else if (
    node.type === TransactionType.TRANSFEROUT &&
    node.Children?.[0]?.User
  ) {
    user = node.Children[0].User
  }
  return user ? <UserLink user={user} size="small" /> : undefined
}

interface TransactionProps {
  node: TransactionFragment
}

export const Transaction: React.FC<TransactionProps> = ({ node }) => {
  const amount = node.amount ?? 0
  const isPositive = amount > 0
  const counterparty = getCounterparty(node)

  return (
    <TransactionItemStyled key={node.id}>
      <TransactionInfoStyled>
        {
          <TransactionTypeComponent
            type={node.type}
            title={node.title}
            isIncoming={isPositive}
          />
        }
        {counterparty && (
          <TransactionUserStyled>
            {isPositive ? 'От' : 'Кому'}: {counterparty}
          </TransactionUserStyled>
        )}
        <FormattedDate value={node.createdAt} format="dateTimeMedium" />
      </TransactionInfoStyled>
      <TransactionAmountStyled $isPositive={isPositive}>
        {isPositive ? '+' : ''}
        {amount} Coins
      </TransactionAmountStyled>
    </TransactionItemStyled>
  )
}

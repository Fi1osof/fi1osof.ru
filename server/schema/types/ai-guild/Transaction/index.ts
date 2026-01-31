import { builder } from '../../../builder'
import { TransactionTypeEnum } from './enums'

builder.prismaObject('Transaction', {
  fields: (t) => ({
    id: t.exposeID('id'),
    type: t.expose('type', { type: TransactionTypeEnum, nullable: false }),
    amount: t.exposeFloat('amount'),
    title: t.exposeString('title', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    userId: t.exposeString('userId'),
    balanceId: t.exposeString('balanceId'),
    Balance: t.relation('Balance'),
    User: t.relation('User'),
    Parent: t.relation('Parent', { nullable: true }),
    Children: t.relation('Children'),
  }),
})

import './inputs'

import './resolvers/createTransfer'
import './resolvers/myTransactions'
import './resolvers/myTransactionsCount'

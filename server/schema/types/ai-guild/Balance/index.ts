import { builder } from '../../../builder'

builder.prismaObject('Balance', {
  fields: (t) => ({
    id: t.exposeID('id'),
    amount: t.exposeFloat('amount'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    userId: t.exposeString('userId'),
    Transactions: t.relation('Transactions'),
  }),
})

import './inputs'

import './resolvers/requestTopUp'
import './resolvers/topUpBalance'

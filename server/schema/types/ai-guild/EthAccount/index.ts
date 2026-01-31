import { builder } from '../../../builder'

builder.prismaObject('EthAccount', {
  fields: (t) => ({
    id: t.exposeID('id'),
    address: t.exposeString('address'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    userId: t.exposeString('userId', { nullable: true }),
  }),
})

import './inputs'

import './resolvers/getNonce'
import './resolvers/authEthAccount'
import './resolvers/generateEthKeys'
import './resolvers/ethAccounts'
import './resolvers/ethAccount'

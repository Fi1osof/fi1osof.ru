import { builder } from '../../../../builder'
import { buildTransactionWhere } from '../helpers'

builder.queryField('myTransactionsCount', (t) =>
  t.int({
    resolve: async (_root, _args, ctx) => {
      return ctx.prisma.transaction.count({
        where: buildTransactionWhere(ctx),
      })
    },
  }),
)

import { builder } from '../../../../builder'
import { buildTransactionWhere } from '../helpers'

builder.queryField('myTransactions', (t) =>
  t.prismaField({
    type: ['Transaction'],
    args: {
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.transaction.findMany({
        ...query,
        where: buildTransactionWhere(ctx),
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)

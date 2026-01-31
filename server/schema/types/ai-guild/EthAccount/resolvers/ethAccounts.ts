import { builder } from '../../../../builder'

builder.queryField('ethAccounts', (t) =>
  t.prismaField({
    type: ['EthAccount'],
    resolve: (query, _root, _args, ctx) => {
      return ctx.prisma.ethAccount.findMany({
        ...query,
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)

import { builder } from 'server/schema/builder'

builder.queryField('redirectRules', (t) =>
  t.prismaField({
    type: ['RedirectRule'],
    args: {
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (_, _root, _args, ctx) => {
      return await ctx.prisma.redirectRule.findMany({
        orderBy: {
          pattern: 'asc',
        },
      })
    },
  }),
)

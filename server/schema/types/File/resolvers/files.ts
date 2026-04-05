import { builder } from '../../../builder'

builder.queryField('files', (t) =>
  t.prismaField({
    type: ['File'],
    args: {
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      const { prisma } = ctx

      return prisma.file.findMany({
        ...query,
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)

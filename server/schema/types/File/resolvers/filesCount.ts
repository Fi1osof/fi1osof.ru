import { builder } from '../../../builder'

builder.queryField('filesCount', (t) =>
  t.int({
    resolve: async (_root, _args, ctx) => {
      const { prisma } = ctx

      return prisma.file.count()
    },
  }),
)

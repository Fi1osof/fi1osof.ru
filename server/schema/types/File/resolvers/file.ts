import { builder } from '../../../builder'

builder.queryField('file', (t) =>
  t.prismaField({
    type: 'File',
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { prisma } = ctx

      return prisma.file.findUnique({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)

import { builder } from '../../../builder'
import { FileWhereUniqueInput } from '../inputs'

builder.queryField('file', (t) =>
  t.prismaField({
    type: 'File',
    nullable: true,
    args: {
      where: t.arg({ type: FileWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { prisma } = ctx

      const { id, path, ...other } = args.where

      return prisma.file.findUnique({
        ...query,
        where: {
          id: id ?? undefined,
          path: path ?? undefined,
          ...other,
        },
      })
    },
  }),
)

import { builder } from '../../../builder'
import { buildFileWhere } from '../helpers/buildWhere'
import { FileWhereInput } from '../inputs'

builder.queryField('filesCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: FileWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      const { prisma } = ctx

      return prisma.file.count({
        where: buildFileWhere(args.where, ctx),
      })
    },
  }),
)

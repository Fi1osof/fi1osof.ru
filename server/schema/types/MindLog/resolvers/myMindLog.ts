import { builder } from 'server/schema/builder'
import { MindLogWhereUniqueInput } from '../inputs'

builder.queryField('myMindLog', (t) =>
  t.prismaField({
    type: 'MindLog',
    nullable: true,
    args: {
      where: t.arg({ type: MindLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        return null
      }

      const mindLogId = args.where.id
      if (!mindLogId) {
        throw new Error('MindLog ID is required')
      }

      return ctx.prisma.mindLog.findUnique({
        ...query,
        where: {
          id: mindLogId,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)

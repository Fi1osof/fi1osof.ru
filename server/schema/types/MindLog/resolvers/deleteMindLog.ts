import { builder } from 'server/schema/builder'
import { MindLogWhereUniqueInput } from '../inputs'

builder.mutationField('deleteMindLog', (t) =>
  t.prismaField({
    type: 'MindLog',
    args: {
      where: t.arg({ type: MindLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      if (!args.where.id) {
        throw new Error('MindLog id is empty')
      }

      const existing = await ctx.prisma.mindLog.findUnique({
        where: {
          id: args.where.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existing) {
        throw new Error('MindLog not found')
      }

      return ctx.prisma.mindLog.delete({
        ...query,
        where: { id: args.where.id },
      })
    },
  }),
)

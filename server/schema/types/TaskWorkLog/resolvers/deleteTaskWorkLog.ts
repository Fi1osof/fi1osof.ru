import { builder } from 'server/schema/builder'
import { TaskWorkLogWhereUniqueInput } from '../inputs'

builder.mutationField('deleteTaskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    args: {
      where: t.arg({ type: TaskWorkLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      const workLogId = args.where.id

      if (!workLogId) {
        throw new Error('WorkLog ID is required')
      }

      const existing = await ctx.prisma.taskWorkLog.findUnique({
        where: {
          id: workLogId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existing) {
        throw new Error('TaskWorkLog not found')
      }

      return ctx.prisma.taskWorkLog.delete({
        ...query,
        where: { id: workLogId },
      })
    },
  }),
)

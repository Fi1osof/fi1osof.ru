import { builder } from '../../../builder'
import { TaskWorkLogUpdateInput, TaskWorkLogWhereUniqueInput } from '../inputs'

builder.mutationField('updateTaskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    args: {
      where: t.arg({ type: TaskWorkLogWhereUniqueInput, required: true }),
      data: t.arg({ type: TaskWorkLogUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      const workLogId = args.where.id

      if (!workLogId) {
        throw new Error('WorkLog ID is required')
      }

      const workLog = await ctx.prisma.taskWorkLog.findFirst({
        where: {
          id: workLogId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!workLog) {
        throw new Error('WorkLog not found')
      }

      return ctx.prisma.taskWorkLog.update({
        ...query,
        where: {
          id: workLogId,
        },
        data: {
          content: args.data.content ?? undefined,
        },
      })
    },
  }),
)

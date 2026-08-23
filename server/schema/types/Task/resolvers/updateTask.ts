import { builder } from 'server/schema/builder'
import { TaskWhereUniqueInput, TaskUpdateInput } from '../inputs'

builder.mutationField('updateTask', (t) =>
  t.prismaField({
    type: 'Task',
    args: {
      where: t.arg({ type: TaskWhereUniqueInput, required: true }),
      data: t.arg({ type: TaskUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const taskId = args.where.id

      if (!taskId) {
        throw new Error('Task ID is required')
      }

      const existing = await ctx.prisma.task.findUnique({
        where: {
          id: taskId,
        },
      })

      if (!existing) {
        throw new Error('Task not found')
      }

      if (!currentUser.sudo) {
        if (existing.createdById !== currentUser.id) {
          throw new Error('Access denied')
        }
      }

      const {
        data: { projectId, ...other },
      } = args

      return prisma.task.update({
        ...query,
        where: {
          id: taskId,
        },
        data: {
          ...other,
          title: args.data.title ?? undefined,
          status: args.data.status ?? undefined,
          projectId: projectId === '' ? null : projectId,
        },
      })
    },
  }),
)

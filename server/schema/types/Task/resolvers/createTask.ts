import { builder } from 'server/schema/builder'
import { TaskCreateInput } from '../inputs'

builder.mutationField('createTask', (t) =>
  t.prismaField({
    type: 'Task',
    args: {
      data: t.arg({ type: TaskCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const {
        data: { assigneeId, projectId, ...other },
      } = args

      return prisma.task.create({
        ...query,
        data: {
          ...other,
          createdById: currentUser.id,
          assigneeId: assigneeId !== undefined ? assigneeId : currentUser.id,
          projectId: projectId || undefined,
        },
      })
    },
  }),
)

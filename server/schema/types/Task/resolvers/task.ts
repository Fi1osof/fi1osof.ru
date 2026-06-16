import { builder } from '../../../builder'
import { hasFieldInSelection } from '../../helpers/hasFieldInSelection'
import { TaskWhereUniqueInput } from '../inputs'

builder.queryField('task', (t) =>
  t.prismaField({
    type: 'Task',
    nullable: true,
    args: {
      where: t.arg({ type: TaskWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx, info) => {
      const taskId = args.where.id
      if (!taskId) {
        throw new Error('Task ID is required')
      }

      return ctx.prisma.task.findUnique({
        ...query,
        where: {
          id: taskId,
        },
        include: {
          Project: hasFieldInSelection(info, 'Project'),
        },
      })
    },
  }),
)

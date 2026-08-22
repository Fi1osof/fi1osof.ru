import { builder } from 'server/schema/builder'
import { TaskWhereInput } from '../inputs'
import { buildTaskWhere } from '../helpers'

builder.queryField('tasksCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: TaskWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      return ctx.prisma.task.count({
        where: buildTaskWhere(args.where),
      })
    },
  }),
)

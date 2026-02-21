import { builder } from '../../../builder'
import { TaskWorkLogWhereInput } from '../inputs'
import { buildTaskWorkLogWhere } from '../helpers'

builder.queryField('taskWorkLogCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: TaskWorkLogWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      return ctx.prisma.taskWorkLog.count({
        where: buildTaskWorkLogWhere(args.where),
      })
    },
  }),
)

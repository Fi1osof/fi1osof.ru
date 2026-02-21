import { builder } from '../../../builder'
import { TaskWorkLogOrderByInput, TaskWorkLogWhereInput } from '../inputs'
import { buildTaskWorkLogWhere } from '../helpers'

builder.queryField('taskWorkLogs', (t) =>
  t.prismaField({
    type: ['TaskWorkLog'],
    args: {
      where: t.arg({ type: TaskWorkLogWhereInput }),
      orderBy: t.arg({ type: TaskWorkLogOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.taskWorkLog.findMany({
        ...query,
        where: buildTaskWorkLogWhere(args.where),
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: args.orderBy?.createdAt ?? 'desc' },
      })
    },
  }),
)

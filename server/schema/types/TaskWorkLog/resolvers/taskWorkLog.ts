import { builder } from '../../../builder'
import { TaskWorkLogWhereUniqueInput } from '../inputs'

builder.queryField('taskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    nullable: true,
    args: {
      where: t.arg({ type: TaskWorkLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.taskWorkLog.findUnique({
        ...query,
        where: {
          id: args.where.id,
        },
      })
    },
  }),
)

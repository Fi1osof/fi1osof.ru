import { builder } from 'server/schema/builder'
import { TaskWorkLogWhereUniqueInput } from '../inputs'

builder.queryField('taskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    nullable: true,
    args: {
      where: t.arg({ type: TaskWorkLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const workLogId = args.where.id

      if (!workLogId) {
        throw new Error('WorkLog ID is required')
      }

      return ctx.prisma.taskWorkLog.findUnique({
        ...query,
        where: {
          id: workLogId,
        },
      })
    },
  }),
)

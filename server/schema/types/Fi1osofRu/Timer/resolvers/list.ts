import { builder } from '../../../../builder'
import { TimerOrderByInput, TimerWhereInput } from '../inputs'
import { buildTimerWhere } from '../helpers/buildTimerWhere'
import { Timer } from '../types'

builder.queryField('timers', (t) =>
  t.field({
    type: [Timer],
    args: {
      where: t.arg({ type: TimerWhereInput }),
      orderBy: t.arg({ type: TimerOrderByInput }),
      take: t.arg.int({
        defaultValue: 100,
      }),
      skip: t.arg.int(),
    },
    resolve: async (_root, args, ctx) => {
      return await ctx.prisma.timer.findMany({
        where: buildTimerWhere(args.where, ctx),
        orderBy: { createdAt: args.orderBy?.createdAt ?? 'desc' },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        include: {
          Task: true,
          CreatedBy: true,
        },
      })
    },
  }),
)

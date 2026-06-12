import { builder } from '../../../../builder'
import { TimerUpdateDataInput, TimerWhereUniqueInput } from '../inputs'
import { Timer } from '../types'

builder.mutationField('updateTimer', (t) =>
  t.field({
    type: Timer,
    args: {
      where: t.arg({ type: TimerWhereUniqueInput, required: true }),
      data: t.arg({ type: TimerUpdateDataInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Не авторизован')
      }

      if (!args.where.id) {
        throw new Error('ID таймера не указан')
      }

      const timer = await ctx.prisma.timer.findUnique({
        where: { id: args.where.id },
      })

      if (!timer) {
        throw new Error('Таймер не найден')
      }

      if (timer.createdById !== ctx.currentUser.id && !ctx.currentUser.sudo) {
        throw new Error('Доступ запрещен')
      }

      const updatedTimer = await ctx.prisma.timer.update({
        where: { id: args.where.id },
        data: {
          startedAt: args.data.startedAt ?? undefined,
          stoppedAt: args.data.stoppedAt ?? undefined,
        },
        include: {
          Task: true,
          CreatedBy: true,
        },
      })

      return updatedTimer
    },
  }),
)

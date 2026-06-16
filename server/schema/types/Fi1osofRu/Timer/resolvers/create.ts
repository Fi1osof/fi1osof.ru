import { builder } from '../../../../builder'
import { TimerCreateInput } from '../inputs'
import { Timer } from '../types'

builder.mutationField('createTimer', (t) =>
  t.field({
    type: Timer,
    args: {
      data: t.arg({ type: TimerCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Не авторизован')
      }

      const { taskId, startedAt } = args.data

      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        throw new Error('Задача не найдена')
      }

      const alreadyRunning = await prisma.timer.findFirst({
        where: {
          taskId,
          createdById: currentUser.id,
          stoppedAt: null,
        },
      })

      if (alreadyRunning) {
        throw new Error('Таймер уже запущен на этой задаче')
      }

      /**
       * Останавливаем все предыдущие таймеры
       */
      await prisma.timer.updateMany({
        where: {
          createdById: currentUser.id,
          stoppedAt: null,
        },
        data: {
          stoppedAt: new Date(),
        },
      })

      /**
       * Создаем новый таймер
       */
      const timer = await prisma.timer.create({
        data: {
          taskId,
          startedAt: startedAt ?? new Date(),
          createdById: currentUser.id,
        },
        include: {
          Task: true,
          CreatedBy: true,
        },
      })

      return timer
    },
  }),
)

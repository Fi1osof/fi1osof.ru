import { builder } from '../../../builder'
import { Task } from '../../Task'
import { User } from '../../User'

export type TimerDbModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  startedAt: Date
  stoppedAt: Date | null
  taskId: string
  createdById: string

  Task?: typeof Task.$inferType
  CreatedBy?: typeof User.$inferType
}

export const Timer = builder.objectType(
  builder.objectRef<TimerDbModel>('Timer'),
  {
    fields(t) {
      return {
        id: t.exposeString('id', {
          nullable: false,
        }),
        createdAt: t.expose('createdAt', { type: 'DateTime', nullable: false }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: false }),
        startedAt: t.expose('startedAt', { type: 'DateTime', nullable: false }),
        stoppedAt: t.expose('stoppedAt', { type: 'DateTime', nullable: true }),
        taskId: t.exposeString('taskId', {
          nullable: false,
        }),
        createdById: t.exposeString('createdById', {
          nullable: false,
        }),
        Task: t.field({
          type: Task,
          nullable: true,
          resolve: (parent) => parent.Task,
        }),
        CreatedBy: t.field({
          type: User,
          nullable: true,
          resolve: (parent) => parent.CreatedBy,
        }),
      }
    },
  },
)

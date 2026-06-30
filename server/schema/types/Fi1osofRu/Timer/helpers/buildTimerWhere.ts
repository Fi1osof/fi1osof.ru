import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { TimerWhereInput } from '../inputs'
import { buildStringFilterWhere } from '../../../helpers/buildStringNullableFilterWhere'
import {
  buildDateTimeFilterWhere,
  buildDateTimeNullableFilterWhere,
} from '../../../helpers/buildDateTimeNullableFilterWhere'

type TimerWhereInputType = typeof TimerWhereInput.$inferInput

export function buildTimerWhere(
  where: TimerWhereInputType | null | undefined,
  _ctx: PrismaContext | undefined,
): Prisma.TimerWhereInput {
  const { id, taskId, createdById, startedAt, stoppedAt, ...other } =
    where || {}

  const result: Prisma.TimerWhereInput = {
    ...other,
    id: buildStringFilterWhere(id),
    taskId: buildStringFilterWhere(taskId),
    createdById: buildStringFilterWhere(createdById),
    startedAt: buildDateTimeFilterWhere(startedAt),
    stoppedAt: buildDateTimeNullableFilterWhere(stoppedAt),
  }

  return result
}

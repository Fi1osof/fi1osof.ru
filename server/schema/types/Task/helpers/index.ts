import { TaskStatus, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { TaskWhereInput } from '../inputs'
import {
  buildStringFilterWhere,
  buildStringNullableFilterWhere,
} from '../../helpers/buildStringNullableFilterWhere'

const COMPLETED_STATUSES = [TaskStatus.Done, TaskStatus.Rejected]

type TaskWhereArgs = typeof TaskWhereInput.$inferInput

interface BuildTaskWhereOptions {
  myOnly?: boolean
}

export function buildTaskWhere(
  args?: TaskWhereArgs | null,
  options?: BuildTaskWhereOptions,
  ctx?: PrismaContext,
): Prisma.TaskWhereInput {
  const {
    id,
    parentId,
    createdById,
    assigneeId,
    incompletedOnly = false,
    ...other
  } = args || {}

  const where: Prisma.TaskWhereInput = {
    ...other,
    id: buildStringFilterWhere(id),
    createdById: buildStringFilterWhere(createdById),
    parentId: buildStringNullableFilterWhere(parentId),
    assigneeId: buildStringNullableFilterWhere(assigneeId),
    status:
      args?.status ??
      (incompletedOnly ? { notIn: COMPLETED_STATUSES } : undefined),
  }

  if (options?.myOnly) {
    if (!ctx?.currentUser) {
      throw new Error('Unauthorized')
    }
    const userId = ctx.currentUser.id
    where.OR = [{ createdById: userId }, { assigneeId: userId }]
  }

  return where
}

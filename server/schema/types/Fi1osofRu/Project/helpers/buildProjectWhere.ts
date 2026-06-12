import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { ProjectWhereInput } from '../inputs'
import { buildStringFilterWhere } from '../../../helpers/buildStringNullableFilterWhere'
import { buildDateTimeFilterWhere } from '../../../helpers/buildDateTimeNullableFilterWhere'

type ProjectWhereInputType = typeof ProjectWhereInput.$inferInput

export function buildProjectWhere(
  where: ProjectWhereInputType | null | undefined,
  ctx: PrismaContext | undefined,
): Prisma.ProjectWhereInput {
  const { currentUser } = ctx || {}

  const { id, name, createdById, commercial, status, createdAt, ...other } =
    where || {}

  const result: Prisma.ProjectWhereInput = {
    ...other,
    id: buildStringFilterWhere(id),
    name: buildStringFilterWhere(name),
    createdById: buildStringFilterWhere(createdById),
    commercial: commercial ?? undefined,
    status: status ?? undefined,
    createdAt: buildDateTimeFilterWhere(createdAt),
  }

  if (currentUser && !currentUser.sudo) {
    result.createdById = currentUser.id
  }

  return result
}

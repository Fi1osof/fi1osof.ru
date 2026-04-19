import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { KBConceptWhereInput } from '../inputs'
import { buildStringNullableFilterWhere } from '../../helpers/buildStringNullableFilterWhere'

type KBConceptsWhereInputType = typeof KBConceptWhereInput.$inferInput

export function buildKBConceptWhere(
  where: KBConceptsWhereInputType | null | undefined,
  _ctx: PrismaContext | undefined,
): Prisma.KBConceptWhereInput {
  const { type, ids, name, ...other } = where || {}

  const result: Prisma.KBConceptWhereInput = {
    type: buildStringNullableFilterWhere(type),
    name: name ?? undefined,
    ...other,
  }

  if (ids?.length) {
    result.id = {
      in: ids,
    }
  }

  return result
}

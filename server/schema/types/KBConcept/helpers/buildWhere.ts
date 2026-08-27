import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { KBConceptWhereInput } from '../inputs'
import {
  buildStringFilterWhere,
  buildStringNullableFilterWhere,
} from '../../helpers/buildStringNullableFilterWhere'

type KBConceptsWhereInputType = typeof KBConceptWhereInput.$inferInput

export function buildKBConceptWhere(
  where: KBConceptsWhereInputType | null | undefined,
  _ctx?: PrismaContext | undefined,
): Prisma.KBConceptWhereInput {
  const {
    // TODO Remove ids
    ids,
    id,
    type,
    name,
    createdById,
    code,
    content,
    description,
    parentId,
    rootId,
    visibility,
    ...other
  } = where || {}

  const result: Prisma.KBConceptWhereInput = {
    id: buildStringFilterWhere(id),
    name: buildStringFilterWhere(name),
    createdById: buildStringFilterWhere(createdById),
    type: buildStringNullableFilterWhere(type),
    code: buildStringNullableFilterWhere(code),
    content: buildStringNullableFilterWhere(content),
    description: buildStringNullableFilterWhere(description),
    parentId: buildStringNullableFilterWhere(parentId),
    rootId: buildStringNullableFilterWhere(rootId),
    visibility: visibility ?? undefined,
    ...other,
  }

  if (ids?.length) {
    result.id = {
      in: ids,
    }
  }

  return result
}

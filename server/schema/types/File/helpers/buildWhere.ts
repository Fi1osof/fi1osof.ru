import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { FileWhereInput } from '../inputs'
import {
  buildStringFilterWhere,
  buildStringNullableFilterWhere,
} from '../../helpers/buildStringNullableFilterWhere'

type FilesWhereInputType = typeof FileWhereInput.$inferInput

export function buildFileWhere(
  where: FilesWhereInputType | null | undefined,
  _ctx: PrismaContext | undefined,
): Prisma.FileWhereInput {
  const { id, mimetype, name, path, ...other } = where || {}

  const result: Prisma.FileWhereInput = {
    id: buildStringFilterWhere(id),
    name: buildStringNullableFilterWhere(name),
    mimetype: buildStringFilterWhere(mimetype),
    path: buildStringFilterWhere(path),
    ...other,
  }

  return result
}

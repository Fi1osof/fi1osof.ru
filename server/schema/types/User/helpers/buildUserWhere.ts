import { UserStatus, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { UserWhereInput } from '../inputs'
import { buildStringNullableFilterWhere } from '../../helpers/buildStringNullableFilterWhere'

export function buildUserWhere(
  where: UserWhereInput | null | undefined,
  ctx: PrismaContext | undefined,
): Prisma.UserWhereInput {
  const { currentUser } = ctx || {}

  const {
    id,
    status,
    username,
    image,
    intro,
    content,
    fullname,
    isAiAgent,
    ...other
  } = where || {}

  const result: Prisma.UserWhereInput = {
    id: id ?? undefined,
    status: status ?? UserStatus.active,
    username: buildStringNullableFilterWhere(username),
    image: buildStringNullableFilterWhere(image),
    intro: buildStringNullableFilterWhere(intro),
    content: buildStringNullableFilterWhere(content),
    fullname: buildStringNullableFilterWhere(fullname),
    isAiAgent: isAiAgent ?? undefined,
    ...other,
  }

  if (currentUser && !status) {
    if (currentUser.sudo) {
      result.status = undefined
    } else {
      result.OR = [
        {
          id: currentUser.id,
        },
        {
          status: result.status,
        },
      ]

      result.status = undefined
    }
  }

  return result
}

import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'

export function buildTransactionWhere(
  ctx: PrismaContext,
): Prisma.TransactionWhereInput {
  if (!ctx.currentUser) {
    throw new Error('Not authenticated')
  }

  return {
    userId: ctx.currentUser.id,
  }
}

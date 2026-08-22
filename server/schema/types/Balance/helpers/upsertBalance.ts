import { PrismaClient } from '@prisma/client'

type upsertBalanceProps = { prisma: PrismaClient; userId: string }

export async function upsertBalance({ prisma, userId }: upsertBalanceProps) {
  return prisma.balance.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
    },
  })
}

import { builder } from '../../../../builder'
import { CreateTransferInput } from '../inputs'
import { upsertBalance } from '../../Balance/helpers/upsertBalance'

builder.mutationField('createTransfer', (t) =>
  t.prismaField({
    type: 'Transaction',
    args: {
      data: t.arg({ type: CreateTransferInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const { toUserId, amount, title } = args.data

      if (amount <= 0) {
        throw new Error('Amount must be positive')
      }

      if (toUserId === currentUser.id) {
        throw new Error('Cannot transfer to yourself')
      }

      const senderBalance = await prisma.balance.findUnique({
        where: { userId: currentUser.id },
      })

      if (!senderBalance || senderBalance.amount < amount) {
        throw new Error('Insufficient balance')
      }

      const recipientBalance = await upsertBalance({
        prisma,
        userId: toUserId,
      })

      return prisma.$transaction(async (tx) => {
        const outgoingTransaction = await tx.transaction.create({
          ...query,
          data: {
            type: 'TransferOut',
            amount: -amount,
            title: title || null,
            User: { connect: { id: currentUser.id } },
            Balance: { connect: { id: senderBalance.id } },
            Children: {
              create: {
                type: 'TransferIn',
                amount: amount,
                title: title || null,
                User: { connect: { id: toUserId } },
                Balance: { connect: { id: recipientBalance.id } },
              },
            },
          },
        })

        await tx.balance.update({
          where: { id: senderBalance.id },
          data: { amount: { decrement: amount } },
        })

        await tx.balance.update({
          where: { id: recipientBalance.id },
          data: { amount: { increment: amount } },
        })

        return outgoingTransaction
      })
    },
  }),
)

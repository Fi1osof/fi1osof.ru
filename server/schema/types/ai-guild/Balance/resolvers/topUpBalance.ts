import { builder } from '../../../../builder'
import { TopUpBalanceInput } from '../inputs'
import {
  verifyTopUpOffer,
  verifySignature,
  verifyUsdtTransaction,
  getRecipientAddress,
  ARBITRUM_CHAIN_ID,
} from '../helpers/topUp'
import { upsertBalance } from '../helpers/upsertBalance'
import { Prisma } from '@prisma/client'

builder.mutationField('topUpBalance', (t) =>
  t.prismaField({
    type: 'Balance',
    args: {
      data: t.arg({ type: TopUpBalanceInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const ethAccount = await prisma.ethAccount.findUnique({
        where: { userId: currentUser.id },
      })

      if (!ethAccount) {
        throw new Error('No ETH account linked to user')
      }

      const { message, signature, txHash } = args.data

      // Verify offer message matches our offer
      if (!verifyTopUpOffer(message)) {
        throw new Error('Invalid offer message')
      }

      // Verify signature
      if (!verifySignature(message, signature, ethAccount.address)) {
        throw new Error('Invalid signature')
      }

      // Check if transaction was already used
      const existingEthTx = await prisma.ethTransaction.findUnique({
        where: { chainId_txHash: { chainId: ARBITRUM_CHAIN_ID, txHash } },
      })
      if (existingEthTx) {
        throw new Error('Transaction already used')
      }

      // Verify transaction on Arbitrum
      const recipientAddress = getRecipientAddress()
      const txResult = await verifyUsdtTransaction(txHash, recipientAddress)

      if (!txResult.success) {
        throw new Error(`Transaction verification failed: ${txResult.error}`)
      }

      // Verify sender matches user's ETH account
      if (txResult.from?.toLowerCase() !== ethAccount.address.toLowerCase()) {
        throw new Error('Transaction sender does not match user ETH account')
      }

      const balance = await upsertBalance({
        prisma,
        userId: currentUser.id,
      })

      if (!txResult.amount || !txResult.from) {
        throw new Error('Transaction verification incomplete')
      }

      const finalAmount = txResult.amount

      const EthTransactionData: Prisma.EthTransactionCreateWithoutTransactionInput =
        {
          chainId: ARBITRUM_CHAIN_ID,
          txHash,
          from: txResult.from,
          to: recipientAddress,
          amount: finalAmount,
          blockNumber: txResult.blockNumber,
          signature,
          message,
          User: {
            connect: {
              id: currentUser.id,
            },
          },
        }

      return prisma.balance.update({
        ...query,
        where: {
          id: balance.id,
        },
        data: {
          amount: { increment: finalAmount },
          Transactions: {
            create: {
              amount: finalAmount,
              title: `Top up balance`,
              type: 'TopUp',
              User: {
                connect: {
                  id: currentUser.id,
                },
              },
              EthTransaction: {
                create: EthTransactionData,
              },
            },
          },
        },
      })
    },
  }),
)

import { builder } from '../../../../builder'
import { EthAccountAuthInput, EthAccountAuthPayload } from '../inputs'
import {
  verifyNonce,
  verifySignature,
  buildSignMessage,
} from '../helpers/crypto'
import { createToken } from '../../../User/helpers/auth'
import { Prisma } from '@prisma/client'

builder.mutationField('authEthAccount', (t) =>
  t.field({
    type: EthAccountAuthPayload,
    args: {
      data: t.arg({ type: EthAccountAuthInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { currentUser } = ctx

      const { address, signature, nonce } = args.data

      if (!verifyNonce(nonce, address)) {
        return {
          success: false,
          message: 'Invalid or expired nonce',
          token: null,
        }
      }

      const message = buildSignMessage(nonce)
      if (!verifySignature(message, signature, address)) {
        return {
          success: false,
          message: 'Invalid signature',
          token: null,
        }
      }

      const ethAccountUser:
        | Prisma.EthAccountUpsertArgs['create']['User']
        | Prisma.EthAccountUpsertArgs['update']['User'] = currentUser
        ? {
            connect: {
              id: currentUser.id,
            },
          }
        : {
            create: {},
          }

      const ethAccount = await ctx.prisma.ethAccount.upsert({
        where: { address: address.toLowerCase() },
        update: {},
        create: {
          address: address.toLowerCase(),
          User: ethAccountUser,
        },
        include: {
          User: true,
        },
      })

      if (!ethAccount.User) {
        return {
          success: false,
          message: 'Failed to create user',
          token: null,
        }
      }

      const token = await createToken(ethAccount.User, ctx)

      return {
        success: true,
        message: null,
        token,
      }
    },
  }),
)

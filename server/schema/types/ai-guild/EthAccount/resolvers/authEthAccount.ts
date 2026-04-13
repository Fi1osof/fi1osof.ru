import { builder } from '../../../../builder'
import { EthAccountAuthInput, EthAccountAuthPayload } from '../inputs'
import {
  verifyNonce,
  verifySignature,
  buildSignMessage,
} from '../helpers/crypto'
import { createToken, TokenType } from '../../../User/helpers/auth'
import { Prisma } from '@prisma/client'
import { checkReferrerToken } from 'server/schema/types/User/helpers/checkReferrerToken'

builder.mutationField('authEthAccount', (t) =>
  t.field({
    type: EthAccountAuthPayload,
    args: {
      data: t.arg({ type: EthAccountAuthInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { currentUser } = ctx

      const { address, signature, nonce, referrerToken } = args.data

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

      let ethAccountUser:
        | Prisma.EthAccountUpsertArgs['create']['User']
        | Prisma.EthAccountUpsertArgs['update']['User']

      if (currentUser) {
        ethAccountUser = {
          connect: {
            id: currentUser.id,
          },
        }
      } else {
        let referrerId: string | null | undefined = undefined

        const ethAccount = await ctx.prisma.ethAccount.findUnique({
          where: { address: address.toLowerCase() },
        })

        if (!ethAccount?.userId) {
          referrerId = await checkReferrerToken({
            referrerToken,
            ctx,
          })
        }

        ethAccountUser = {
          create: {
            referrerId,
          },
        }
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

      const token = await createToken(ethAccount.User, ctx, TokenType.Auth)

      return {
        success: true,
        message: null,
        token,
      }
    },
  }),
)

import { builder } from '../../../builder'
import { AuthPayload, UserSignupDataInput } from '../inputs'
import { createToken, hashPassword, TokenType } from '../helpers/auth'
import { Prisma, UserStatus } from '@prisma/client'
import { checkReferrerToken } from '../helpers/checkReferrerToken'

builder.mutationField('signup', (t) =>
  t.field({
    type: AuthPayload,
    args: {
      data: t.arg({ type: UserSignupDataInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      // const password = args.data.password
      // const email = args.data.email || undefined
      // const username = args.data.username || undefined
      // const fullname = args.data.fullname || undefined
      // const referrerToken = args.data.referrerToken

      const {
        password,
        email,
        fullname,
        referrerToken,
        username,
        isAiAgent,
        ...other
      } = args.data

      const referrerId = await checkReferrerToken({
        referrerToken,
        ctx,
      })

      if (
        email &&
        (await ctx.prisma.user.findUnique({
          where: { email },
        }))
      ) {
        throw new Error('Email already registered')
      }

      if (
        username &&
        (await ctx.prisma.user.findUnique({
          where: { username },
        }))
      ) {
        throw new Error('Username already taken')
      }

      if (!password) {
        throw new Error('Password is required')
      }

      const hashedPassword = await hashPassword(password)

      let status: UserStatus

      const defaultStatus = process.env.USER_DEFAULT_STATUS as
        | undefined
        | keyof typeof UserStatus

      if (defaultStatus) {
        if (Object.values(UserStatus).includes(defaultStatus)) {
          status = defaultStatus
        } else {
          throw new Error('defaultStatus value is not match UserStatus enum')
        }
      } else {
        status = UserStatus.active
      }

      const data: Prisma.UserCreateInput = {
        ...other,
        email,
        username,
        fullname,
        password: hashedPassword,
        status,
        isAiAgent: isAiAgent ?? undefined,
        Referrer: referrerId
          ? {
              connect: {
                id: referrerId,
              },
            }
          : undefined,
      }

      const user = await ctx.prisma.user.create({
        data,
      })

      const token = await createToken(user, ctx, TokenType.Auth)

      return {
        success: true,
        message: null,
        token,
      }
    },
  }),
)

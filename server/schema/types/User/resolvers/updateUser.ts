import { Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import { UserUpdateDataInput, UserWhereUniqueInput } from '../inputs'
import { hashPassword } from '../helpers/auth'

builder.mutationField('updateUser', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      data: t.arg({ type: UserUpdateDataInput, required: true }),
      where: t.arg({ type: UserWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser } = ctx

      if (!currentUser?.sudo) {
        throw new Error('Access denied')
      }

      const { status, password, ...other } = args.data
      const { id: userId } = args.where

      if (!userId) {
        throw new Error('id did not provided')
      }

      if (currentUser.id === userId) {
        throw new Error('Can not update self account via this method')
      }

      const data: Prisma.UserUpdateInput = {
        ...other,
        status: status ?? undefined,
        password: password ? await hashPassword(password) : undefined,
      }

      return ctx.prisma.user.update({
        ...query,
        data,
        where: {
          id: userId,
        },
      })
    },
  }),
)

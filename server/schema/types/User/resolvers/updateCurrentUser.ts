import { builder } from 'server/schema/builder'
import { CurrentUserUpdateInput } from '../inputs'
import { hashPassword } from '../helpers/auth'
import { validateMdxContent } from 'server/helpers/validateMdxContent'
import { Prisma } from '@prisma/client'

builder.mutationField('updateCurrentUser', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      data: t.arg({ type: CurrentUserUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser } = ctx

      if (!currentUser) {
        throw new Error('Authorization required')
      }

      const { password: passwordProp, content, isAiAgent, ...other } = args.data

      const password = passwordProp
        ? await hashPassword(passwordProp)
        : undefined

      const data: Prisma.UserUpdateInput = {
        ...other,
        password,
        content: validateMdxContent(content),
        isAiAgent: isAiAgent ?? undefined,
      }

      return ctx.prisma.user.update({
        ...query,
        data,
        where: {
          id: currentUser.id,
        },
      })
    },
  }),
)

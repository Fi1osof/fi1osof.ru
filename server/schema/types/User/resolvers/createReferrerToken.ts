import { builder } from '../../../builder'
import { REFERRER_TOKEN_TTL } from '../interfaces'
import { createToken, TokenType } from '../helpers/auth'

builder.mutationField('createReferrerToken', (t) =>
  t.string({
    nullable: false,
    resolve: async (_root, _args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      return createToken(ctx.currentUser, ctx, TokenType.Referrer, {
        expiresIn: REFERRER_TOKEN_TTL,
        algorithm: 'HS256',
      })
    },
  }),
)

import { builder } from '../../../builder'
import { RedirectPatternTypeEnum } from '../types'

const CreateRedirectRuleInput = builder.inputType('CreateRedirectRuleInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    pattern: t.string({ required: true }),
    patternType: t.field({ type: RedirectPatternTypeEnum, required: true }),
    replacement: t.string({ required: true }),
    statusCode: t.int({ required: false }),
    priority: t.int({ required: false }),
    enabled: t.boolean({ required: false }),
    comment: t.string({ required: false }),
  }),
})

builder.mutationField('createRedirectRule', (t) =>
  t.prismaField({
    type: 'RedirectRule',
    args: {
      data: t.arg({ type: CreateRedirectRuleInput, required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser?.sudo) {
        throw new Error('Access denied')
      }

      const {
        name,
        pattern,
        patternType,
        replacement,
        statusCode,
        priority,
        enabled,
        comment,
      } = args.data

      const rule = await prisma.redirectRule.create({
        data: {
          name,
          pattern,
          patternType,
          replacement,
          statusCode: statusCode ?? 301,
          priority: priority ?? 0,
          enabled: enabled ?? true,
          comment,
        },
      })

      return rule
    },
  }),
)

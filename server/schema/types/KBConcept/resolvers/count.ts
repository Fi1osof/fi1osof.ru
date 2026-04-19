import { builder } from '../../../builder'
import { buildKBConceptWhere } from '../helpers/buildWhere'
import { KBConceptWhereInput } from '../inputs'

builder.queryField('kBConceptsCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: KBConceptWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      return await ctx.prisma.kBConcept.count({
        where: buildKBConceptWhere(args.where, ctx),
      })
    },
  }),
)

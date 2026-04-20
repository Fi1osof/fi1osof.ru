import { builder } from '../../../builder'
import { KBConceptWhereUniqueInput } from '../inputs'

builder.queryField('concept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      where: t.arg({ type: KBConceptWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const {
        where: { id },
      } = args

      const concept = await ctx.prisma.kBConcept.findUnique({
        ...query,
        where: {
          id: id ?? undefined,
        },
      })

      if (!concept) {
        throw new Error('Concept not found or access denied')
      }

      return concept
    },
  }),
)

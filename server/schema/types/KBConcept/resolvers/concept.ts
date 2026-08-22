import { builder } from 'server/schema/builder'
import { KBConceptWhereUniqueInput } from '../inputs'

builder.queryField('concept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      where: t.arg({ type: KBConceptWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const {
        where: { id, uri, ...other },
      } = args

      const concept = await ctx.prisma.kBConcept.findUnique({
        ...query,
        where: {
          id: id ?? undefined,
          uri: uri ?? undefined,
          ...other,
        },
      })

      return concept
    },
  }),
)

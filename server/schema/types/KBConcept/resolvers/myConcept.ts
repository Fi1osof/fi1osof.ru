import { builder } from 'server/schema/builder'

builder.queryField('myConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const concept = await ctx.prisma.kBConcept.findUnique({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!concept) {
        throw new Error('Concept not found or access denied')
      }

      return concept
    },
  }),
)

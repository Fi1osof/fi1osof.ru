import { builder } from 'server/schema/builder'

builder.queryField('myProposal', (t) =>
  t.prismaField({
    type: 'KBProposal',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const proposal = await ctx.prisma.kBProposal.findUnique({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!proposal) {
        throw new Error('Proposal not found or access denied')
      }

      return proposal
    },
  }),
)

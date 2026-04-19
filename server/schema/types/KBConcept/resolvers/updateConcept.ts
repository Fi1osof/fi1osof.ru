import { Prisma } from '@prisma/client'
import { builder } from '../../../builder'
import { KBConceptUpdateInput } from '../inputs'

builder.mutationField('updateConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBConceptUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const {
        data: { data, name, ...other },
      } = args

      // Check if concept exists and belongs to user
      const existingConcept = await ctx.prisma.kBConcept.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingConcept) {
        throw new Error('Concept not found or access denied')
      }

      return ctx.prisma.kBConcept.update({
        ...query,
        where: { id: args.id },
        data: {
          ...other,
          data: data as Prisma.KBConceptUpdateInput['data'],
          name: name ?? undefined,
        },
      })
    },
  }),
)

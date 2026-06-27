import { Prisma } from '@prisma/client'
import { builder } from '../../../builder'
import { KBConceptUpdateInput, KBConceptWhereUniqueInput } from '../inputs'

builder.mutationField('updateConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      where: t.arg({ type: KBConceptWhereUniqueInput, required: true }),
      data: t.arg({ type: KBConceptUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser } = ctx

      if (!currentUser) {
        throw new Error('Unauthorized')
      }

      const {
        data: { data, name, ...other },
        where: { id },
      } = args

      // Check if concept exists and belongs to user
      const existing = await ctx.prisma.kBConcept.findUnique({
        where: {
          id: id ?? undefined,
        },
      })

      if (!existing) {
        throw new Error('File not found')
      }

      if (existing.createdById !== currentUser.id && !currentUser.sudo) {
        throw new Error('Can not edit alien file')
      }

      // if (!existingConcept) {
      //   throw new Error('Concept not found or access denied')
      // }

      return ctx.prisma.kBConcept.update({
        ...query,
        where: { id: existing.id },
        data: {
          ...other,
          data: data as Prisma.KBConceptUpdateInput['data'],
          name: name ?? undefined,
        },
      })
    },
  }),
)

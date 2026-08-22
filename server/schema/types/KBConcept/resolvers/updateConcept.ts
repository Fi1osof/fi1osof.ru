import { Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import { KBConceptUpdateInput, KBConceptWhereUniqueInput } from '../inputs'
import { prepareConceptData } from '../helpers/validateConceptData'

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
        data: { name, quality, data: dataArg, visibility, ...other },
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

      const data: Prisma.KBConceptUpdateInput = {
        ...other,
        name: name ?? undefined,
        quality: quality ?? undefined,
        visibility: visibility ?? undefined,
        data: dataArg as Prisma.KBConceptCreateInput['data'],
      }

      prepareConceptData(data)

      return ctx.prisma.kBConcept.update({
        ...query,
        where: { id: existing.id },
        data,
      })
    },
  }),
)

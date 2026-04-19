import { Prisma } from '@prisma/client'
import { builder } from '../../../builder'
import { KBConceptCreateInput } from '../inputs'

builder.mutationField('createConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      data: t.arg({ type: KBConceptCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const {
        data: { data, ...other },
      } = args

      return ctx.prisma.kBConcept.create({
        ...query,
        data: {
          ...other,
          data: data as Prisma.KBConceptCreateInput['data'],
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)

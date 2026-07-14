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
        data: { name, quality, data: dataArg, visibility, ...other },
      } = args

      if (!name) {
        throw new Error('name required')
      }

      const data: Prisma.KBConceptCreateInput = {
        ...other,
        name,
        quality: quality ?? undefined,
        visibility: visibility ?? undefined,
        data: dataArg as Prisma.KBConceptCreateInput['data'],
        CreatedBy: {
          connect: {
            id: ctx.currentUser.id,
          },
        },
      }

      return ctx.prisma.kBConcept.create({
        ...query,
        data,
      })
    },
  }),
)

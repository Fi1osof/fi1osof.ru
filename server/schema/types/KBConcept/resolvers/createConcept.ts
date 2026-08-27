import { Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import { KBConceptCreateInput } from '../inputs'
import { createCUID } from '../../helpers/createCUID'
import { slugifyUri } from '../../helpers/slugifyUri'

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
        data: { name, quality, data: dataArg, visibility, uri, ...other },
      } = args

      if (!name) {
        throw new Error('name required')
      }

      const id = createCUID()

      const data: Prisma.KBConceptCreateInput = {
        ...other,
        id,
        name,
        quality: quality ?? undefined,
        visibility: visibility ?? undefined,
        data: dataArg as Prisma.KBConceptCreateInput['data'],
        uri: slugifyUri(uri || `/concepts/${name}`),
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

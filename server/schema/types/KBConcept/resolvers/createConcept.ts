import { Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import { KBConceptCreateInput } from '../inputs'
import { createCUID } from '../../helpers/createCUID'
import { slugifyUri } from '../../helpers/slugifyUri'
import { buildValidUrisSet } from '../helpers/buildValidUrisSet'
import { removeInvalidLinks } from '../helpers/validateInternalLinks'
import { normalizeMarkdownContent } from '../helpers/normalizeMarkdownContent'

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
        data: {
          name,
          quality,
          data: dataArg,
          visibility,
          uri,
          content,
          ...other
        },
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

      if (content) {
        const validUris = await buildValidUrisSet(ctx)

        // 1. Remove invalid internal links
        let processedContent = (
          await removeInvalidLinks(content, validUris, true)
        ).content

        // 2. Normalize markdown: add blank lines after opening tags for proper rendering
        processedContent = await normalizeMarkdownContent(processedContent)

        data.content = processedContent
      }

      return ctx.prisma.kBConcept.create({
        ...query,
        data,
      })
    },
  }),
)

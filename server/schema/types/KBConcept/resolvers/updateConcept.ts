import { Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import { KBConceptUpdateInput, KBConceptWhereUniqueInput } from '../inputs'
import { prepareConceptData } from '../helpers/validateConceptData'
import { processUriChange } from '../../helpers/processUriChange'
import { createConceptLink } from 'src/components/Link/Concept'
import { buildValidUrisSet } from '../helpers/buildValidUrisSet'
import { removeInvalidLinks } from '../helpers/validateInternalLinks'
import { normalizeMarkdownContent } from '../helpers/normalizeMarkdownContent'

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
        data: {
          name,
          quality,
          data: dataArg,
          visibility,
          uri,
          content,
          ...other
        },
        where: { id, uri: uriWhere },
      } = args

      // Check if concept exists and belongs to user
      const existing = await ctx.prisma.kBConcept.findUnique({
        where: {
          id: id ?? undefined,
          uri: uriWhere ?? undefined,
        },
      })

      if (!existing) {
        throw new Error('Can not get concept')
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

      if (uri) {
        const oldUri = createConceptLink(existing)

        data.uri = await processUriChange(ctx.prisma, oldUri, uri)
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

      prepareConceptData(data)

      return ctx.prisma.kBConcept.update({
        ...query,
        where: { id: existing.id },
        data,
      })
    },
  }),
)

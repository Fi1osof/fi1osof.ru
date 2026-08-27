import { KBConcept, Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import {
  InvalidLink,
  removeInvalidLinks,
} from '../../helpers/validateInternalLinks'
import { buildValidUrisSet } from '../../helpers/buildValidUrisSet'
import { KBConceptWhereInput } from 'server/schema/types/KBConcept'
import { buildKBConceptWhere } from 'server/schema/types/KBConcept/helpers/buildWhere'

builder.mutationField('validateConcepts', (t) =>
  t.field({
    type: 'Json',
    args: {
      where: t.arg({
        type: KBConceptWhereInput,
      }),
      write: t.arg.boolean({
        required: true,
      }),
      limit: t.arg.int({
        required: true,
      }),
    },
    async resolve(_, { write, where: whereArg, limit }, ctx) {
      const { currentUser, prisma } = ctx

      if (write && !currentUser?.sudo) {
        throw new Error('Write operation is available only to administrator')
      }

      const where: Prisma.KBConceptWhereInput = buildKBConceptWhere({
        ...whereArg,
        visibility: 'public',
      })

      const concepts = await prisma.kBConcept.findMany({
        where,
        take: limit || undefined,
      })

      const total = concepts.length
      let success = 0
      let skipped = 0

      const failed: Array<{
        concept: KBConcept
        invalidLinks?: InvalidLink[]
        error?: unknown
      }> = []

      const validUris = await buildValidUrisSet(ctx)

      for await (const concept of concepts) {
        if (!concept.content) {
          skipped++
          continue
        }

        await removeInvalidLinks(concept.content, validUris, write)
          .then(async (response) => {
            const { invalidLinks, content: updatedContentAfterLinksCleanup } =
              response || {}

            if (invalidLinks?.length) {
              failed.push({
                invalidLinks,
                concept,
              })

              if (updatedContentAfterLinksCleanup) {
                await prisma.kBConcept.update({
                  where: {
                    id: concept.id,
                  },
                  data: {
                    content: updatedContentAfterLinksCleanup,
                  },
                })
              }
            } else {
              success++
            }
          })
          .catch((error) => {
            failed.push({
              error,
              concept,
            })
          })
      }

      return {
        total,
        success,
        skipped,
        failed,
      }
    },
  }),
)

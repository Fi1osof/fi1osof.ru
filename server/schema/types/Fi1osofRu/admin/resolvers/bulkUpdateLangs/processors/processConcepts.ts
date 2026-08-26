import { KBConcept, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import {
  LOCALE_CODES,
  LOCALES,
} from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'
// import { buildKBConceptWhere } from 'server/schema/types/KBConcept/helpers/buildWhere'
import { updateConceptLang } from '../helpers/updateConceptLang'
import { langKey, ProcessorResult } from '../interfaces'

type ProcessConceptsArgs = {
  ctx: PrismaContext
  // whereArg: Parameters<typeof buildKBConceptWhere>[0]
  ids?: string[]
  limit: number
  langsLimit: number | null | undefined
  processAllLangs: boolean
  force: boolean
  validUris: Set<string>
}

export async function processConcepts({
  ctx,
  // whereArg,
  ids,
  limit,
  langsLimit,
  processAllLangs,
  force,
  validUris,
}: ProcessConceptsArgs): Promise<ProcessorResult> {
  const { prisma } = ctx

  const prismaWhere: Prisma.KBConceptWhereInput = {
    // ...buildKBConceptWhere(whereArg, ctx),
  }

  const where: Prisma.KBConceptWhereInput = {
    AND: [prismaWhere],
  }

  if (ids && ids.length > 0) {
    where.id = { in: ids }
  }

  if (!force) {
    const langConditions = LOCALE_CODES.filter((c) => c !== 'ru')
      .map((c) => `"${c}" IS NULL`)
      .join(' OR ')

    const idsWithMissingLang = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "KBConcept" WHERE ${Prisma.raw(langConditions)}
    `

    where.id = {
      in: idsWithMissingLang.map((r) => r.id),
    }
  }

  const concepts = await prisma.kBConcept.findMany({
    where,
    select: { id: true },
  })

  let processed = 0
  let skipped = 0
  let success = 0

  const failed: Array<{
    entity: KBConcept
    error: unknown
  }> = []

  const allLangs = Object.keys(LOCALES).filter((n): n is langKey => n !== 'ru')

  for (const { id } of concepts) {
    const concept = await prisma.kBConcept.findUnique({
      where: { id },
    })

    if (!concept) {
      continue
    }

    const langsToProcess: langKey[] = []
    for (const lang of allLangs) {
      if (force || !concept[lang]) {
        langsToProcess.push(lang)
      }
    }

    if (langsToProcess.length === 0) {
      skipped++
      processed++
      if (limit && processed >= limit) {
        break
      }
      continue
    }

    const batchSize = !langsLimit ? langsToProcess.length : langsLimit
    const batches: langKey[][] = []

    if (processAllLangs) {
      for (let i = 0; i < langsToProcess.length; i += batchSize) {
        batches.push(langsToProcess.slice(i, i + batchSize))
      }
    } else {
      batches.push(langsToProcess.slice(0, batchSize))
    }

    let conceptSuccess = false
    for (const batch of batches) {
      await updateConceptLang({
        ctx,
        concept,
        validUris,
        targetLangs: batch,
      })
        .then((r) => {
          if (r === true) {
            conceptSuccess = true
          }
        })
        .catch((error) => {
          console.error('error', error)

          failed.push({
            error: {
              message: error.message,
              stack: error.stack,
            },
            entity: concept,
          })
        })
    }

    if (conceptSuccess) {
      success++
    }

    processed++

    if (limit && processed >= limit) {
      break
    }
  }

  return {
    total: concepts.length,
    processed,
    skipped,
    success,
    failed,
  }
}

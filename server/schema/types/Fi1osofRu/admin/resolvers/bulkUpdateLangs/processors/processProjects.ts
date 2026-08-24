import { Prisma, Project } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import {
  LOCALE_CODES,
  LOCALES,
} from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'
import { updateProjectLang } from '../helpers/updateProjectLang'
import { langKey, ProcessorResult } from '../interfaces'

type ProcessProjectsArgs = {
  ctx: PrismaContext
  limit: number
  langsLimit: number
  processAllLangs: boolean
  force: boolean
  validUris: Set<string>
}

export async function processProjects({
  ctx,
  limit,
  langsLimit,
  processAllLangs,
  force,
  validUris,
}: ProcessProjectsArgs): Promise<ProcessorResult> {
  const { prisma } = ctx

  const where: Prisma.ProjectWhereInput = {}

  if (!force) {
    const langConditions = LOCALE_CODES.filter((c) => c !== 'ru')
      .map((c) => `"${c}" IS NULL`)
      .join(' OR ')

    const idsWithMissingLang = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Project" WHERE ${Prisma.raw(langConditions)}
    `

    where.id = {
      in: idsWithMissingLang.map((r) => r.id),
    }
  }

  const projects = await prisma.project.findMany({
    where,
    select: { id: true },
  })

  let processed = 0
  let skipped = 0
  let success = 0

  const failed: Array<{
    entity: Project
    error: unknown
  }> = []

  const allLangs = Object.keys(LOCALES).filter((n): n is langKey => n !== 'ru')

  for (const { id } of projects) {
    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      continue
    }

    const langsToProcess: langKey[] = []
    for (const lang of allLangs) {
      if (force || !project[lang]) {
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

    const batchSize = langsLimit === 0 ? langsToProcess.length : langsLimit
    const batches: langKey[][] = []

    if (processAllLangs) {
      for (let i = 0; i < langsToProcess.length; i += batchSize) {
        batches.push(langsToProcess.slice(i, i + batchSize))
      }
    } else {
      batches.push(langsToProcess.slice(0, batchSize))
    }

    let projectSuccess = false
    for (const batch of batches) {
      await updateProjectLang({
        ctx,
        project,
        validUris,
        targetLangs: batch,
      })
        .then((r) => {
          if (r === true) {
            projectSuccess = true
          }
        })
        .catch((error) => {
          console.error('error', error)

          failed.push({
            error: {
              message: error.message,
              stack: error.stack,
            },
            entity: project,
          })
        })
    }

    if (projectSuccess) {
      success++
    }

    processed++

    if (limit && processed >= limit) {
      break
    }
  }

  return {
    total: projects.length,
    processed,
    skipped,
    success,
    failed,
  }
}

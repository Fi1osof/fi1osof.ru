import { Prisma, TaskWorkLog } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import {
  LOCALE_CODES,
  LOCALES,
} from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'
import { updateTaskWorkLogLang } from '../helpers/updateTaskWorkLogLang'
import { langKey, ProcessorResult } from '../interfaces'

type ProcessTaskWorkLogsArgs = {
  ctx: PrismaContext
  limit: number
  langsLimit: number
  processAllLangs: boolean
  force: boolean
  validUris: Set<string>
}

export async function processTaskWorkLogs({
  ctx,
  limit,
  langsLimit,
  processAllLangs,
  force,
  validUris,
}: ProcessTaskWorkLogsArgs): Promise<ProcessorResult> {
  const { prisma } = ctx

  const where: Prisma.TaskWorkLogWhereInput = {}

  if (!force) {
    const langConditions = LOCALE_CODES.filter((c) => c !== 'ru')
      .map((c) => `"${c}" IS NULL`)
      .join(' OR ')

    const idsWithMissingLang = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "TaskWorkLog" WHERE ${Prisma.raw(langConditions)}
    `

    where.id = {
      in: idsWithMissingLang.map((r) => r.id),
    }
  }

  const workLogs = await prisma.taskWorkLog.findMany({
    where,
    select: { id: true },
  })

  let processed = 0
  let skipped = 0
  let success = 0

  const failed: Array<{
    entity: TaskWorkLog
    error: unknown
  }> = []

  const allLangs = Object.keys(LOCALES).filter((n): n is langKey => n !== 'ru')

  for (const { id } of workLogs) {
    const workLog = await prisma.taskWorkLog.findUnique({
      where: { id },
    })

    if (!workLog) {
      continue
    }

    const langsToProcess: langKey[] = []
    for (const lang of allLangs) {
      if (force || !workLog[lang]) {
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

    let workLogSuccess = false
    for (const batch of batches) {
      await updateTaskWorkLogLang({
        ctx,
        workLog,
        validUris,
        targetLangs: batch,
      })
        .then((r) => {
          if (r === true) {
            workLogSuccess = true
          }
        })
        .catch((error) => {
          console.error('error', error)

          failed.push({
            error: {
              message: error.message,
              stack: error.stack,
            },
            entity: workLog,
          })
        })
    }

    if (workLogSuccess) {
      success++
    }

    processed++

    if (limit && processed >= limit) {
      break
    }
  }

  return {
    total: workLogs.length,
    processed,
    skipped,
    success,
    failed,
  }
}

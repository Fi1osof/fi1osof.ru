import { Prisma, Task } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import {
  LOCALE_CODES,
  LOCALES,
} from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'
import { updateTaskLang } from '../helpers/updateTaskLang'
import { langKey, ProcessorResult } from '../interfaces'

type ProcessTasksArgs = {
  ctx: PrismaContext
  limit: number
  langsLimit: number
  processAllLangs: boolean
  force: boolean
  validUris: Set<string>
}

export async function processTasks({
  ctx,
  limit,
  langsLimit,
  processAllLangs,
  force,
  validUris,
}: ProcessTasksArgs): Promise<ProcessorResult> {
  const { prisma } = ctx

  const where: Prisma.TaskWhereInput = {}

  if (!force) {
    const langConditions = LOCALE_CODES.filter((c) => c !== 'ru')
      .map((c) => `"${c}" IS NULL`)
      .join(' OR ')

    const idsWithMissingLang = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Task" WHERE ${Prisma.raw(langConditions)}
    `

    where.id = {
      in: idsWithMissingLang.map((r) => r.id),
    }
  }

  const tasks = await prisma.task.findMany({
    where,
    select: { id: true },
  })

  let processed = 0
  let skipped = 0
  let success = 0

  const failed: Array<{
    entity: Task
    error: unknown
  }> = []

  const allLangs = Object.keys(LOCALES).filter((n): n is langKey => n !== 'ru')

  for (const { id } of tasks) {
    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      continue
    }

    const langsToProcess: langKey[] = []
    for (const lang of allLangs) {
      if (force || !task[lang]) {
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

    let taskSuccess = false
    for (const batch of batches) {
      await updateTaskLang({
        ctx,
        task,
        validUris,
        targetLangs: batch,
      })
        .then((r) => {
          if (r === true) {
            taskSuccess = true
          }
        })
        .catch((error) => {
          console.error('error', error)

          failed.push({
            error: {
              message: error.message,
              stack: error.stack,
            },
            entity: task,
          })
        })
    }

    if (taskSuccess) {
      success++
    }

    processed++

    if (limit && processed >= limit) {
      break
    }
  }

  return {
    total: tasks.length,
    processed,
    skipped,
    success,
    failed,
  }
}

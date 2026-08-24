import { Prisma, TaskWorkLog } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { FieldToTranslate, langKey } from '../interfaces'
import { baseUpdateLang } from './baseUpdateLang'

function mapTaskWorkLogFields(workLog: TaskWorkLog): FieldToTranslate[] {
  const fields: FieldToTranslate[] = []
  if (workLog.content) {
    fields.push({ field: 'content', value: workLog.content })
  }
  return fields
}

type updateTaskWorkLogLangProps = {
  ctx: PrismaContext
  workLog: TaskWorkLog
  validUris: Set<string>
  targetLangs: langKey[]
}

export async function updateTaskWorkLogLang({
  ctx,
  workLog,
  validUris,
  targetLangs,
}: updateTaskWorkLogLangProps): Promise<true | null> {
  return baseUpdateLang({
    ctx,
    id: workLog.id,
    existingLangs: { en: workLog.en, vi: workLog.vi },
    fieldsToTranslate: mapTaskWorkLogFields(workLog),
    validUris,
    targetLangs,
    updateEntity: async (id, data) => {
      await ctx.prisma.taskWorkLog.update({
        where: { id },
        data: data as Prisma.TaskWorkLogUpdateInput,
      })
    },
  })
}

import { Prisma, Task } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { FieldToTranslate, langKey } from '../interfaces'
import { baseUpdateLang } from './baseUpdateLang'

function mapTaskFields(task: Task): FieldToTranslate[] {
  const fields: FieldToTranslate[] = []
  if (task.title) {
    fields.push({ field: 'title', value: task.title })
  }
  if (task.description) {
    fields.push({ field: 'description', value: task.description })
  }
  if (task.content) {
    fields.push({ field: 'content', value: task.content })
  }
  return fields
}

type updateTaskLangProps = {
  ctx: PrismaContext
  task: Task
  validUris: Set<string>
  targetLangs: langKey[]
}

export async function updateTaskLang({
  ctx,
  task,
  validUris,
  targetLangs,
}: updateTaskLangProps): Promise<true | null> {
  return baseUpdateLang({
    ctx,
    id: task.id,
    existingLangs: { en: task.en, vi: task.vi },
    fieldsToTranslate: mapTaskFields(task),
    validUris,
    targetLangs,
    updateEntity: async (id, data) => {
      await ctx.prisma.task.update({
        where: { id },
        data: data as Prisma.TaskUpdateInput,
      })
    },
  })
}

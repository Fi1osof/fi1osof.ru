import { Prisma, Project } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { FieldToTranslate, langKey } from '../interfaces'
import { baseUpdateLang } from './baseUpdateLang'

function mapProjectFields(project: Project): FieldToTranslate[] {
  const fields: FieldToTranslate[] = []
  if (project.name) {
    fields.push({ field: 'name', value: project.name })
  }
  if (project.description) {
    fields.push({ field: 'description', value: project.description })
  }
  if (project.intro) {
    fields.push({ field: 'intro', value: project.intro })
  }
  if (project.content) {
    fields.push({ field: 'content', value: project.content })
  }
  return fields
}

type updateProjectLangProps = {
  ctx: PrismaContext
  project: Project
  validUris: Set<string>
  targetLangs: langKey[]
}

export async function updateProjectLang({
  ctx,
  project,
  validUris,
  targetLangs,
}: updateProjectLangProps): Promise<true | null> {
  return baseUpdateLang({
    ctx,
    id: project.id,
    existingLangs: { en: project.en, vi: project.vi },
    fieldsToTranslate: mapProjectFields(project),
    validUris,
    targetLangs,
    updateEntity: async (id, data) => {
      await ctx.prisma.project.update({
        where: { id },
        data: data as Prisma.ProjectUpdateInput,
      })
    },
  })
}

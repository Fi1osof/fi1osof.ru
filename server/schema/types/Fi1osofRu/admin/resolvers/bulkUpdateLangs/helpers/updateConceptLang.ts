import { KBConcept, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { FieldToTranslate, langKey } from '../interfaces'
import { baseUpdateLang } from './baseUpdateLang'

function mapConceptFields(concept: KBConcept): FieldToTranslate[] {
  const fields: FieldToTranslate[] = []
  if (concept.name) {
    fields.push({ field: 'name', value: concept.name })
  }
  if (concept.description) {
    fields.push({ field: 'description', value: concept.description })
  }
  if (concept.intro) {
    fields.push({ field: 'intro', value: concept.intro })
  }
  if (concept.content) {
    fields.push({ field: 'content', value: concept.content })
  }
  return fields
}

type updateConceptLangProps = {
  ctx: PrismaContext
  concept: KBConcept
  validUris: Set<string>
  targetLangs: langKey[]
}

export async function updateConceptLang({
  ctx,
  concept,
  validUris,
  targetLangs,
}: updateConceptLangProps): Promise<true | null> {
  return baseUpdateLang({
    ctx,
    id: concept.id,
    existingLangs: { en: concept.en, vi: concept.vi },
    fieldsToTranslate: mapConceptFields(concept),
    validUris,
    targetLangs,
    updateEntity: async (id, data) => {
      await ctx.prisma.kBConcept.update({
        where: { id },
        data: data as Prisma.KBConceptUpdateInput,
      })
    },
  })
}

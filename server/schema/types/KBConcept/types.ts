import { KBConceptVisibility } from '@prisma/client'
import { builder } from 'server/schema/builder'

export const KBConceptVisibilityEnum = builder.enumType('KBConceptVisibility', {
  values: Object.values(KBConceptVisibility),
})

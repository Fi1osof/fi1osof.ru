import { RedirectPatternType } from '@prisma/client'
import { builder } from 'server/schema/builder'

export const RedirectPatternTypeEnum = builder.enumType('RedirectPatternType', {
  values: Object.values(RedirectPatternType),
})

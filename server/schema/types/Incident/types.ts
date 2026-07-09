import { IncidentStatus } from '@prisma/client'
import { builder } from 'server/schema/builder'

export const IncidentStatusEnum = builder.enumType('IncidentStatus', {
  values: Object.values(IncidentStatus),
})

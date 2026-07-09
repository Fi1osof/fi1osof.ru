import { SystemLogLevel, SystemLogSource } from '@prisma/client'
import { builder } from 'server/schema/builder'

export const SystemLogLevelEnum = builder.enumType('SystemLogLevel', {
  values: Object.values(SystemLogLevel),
})

export const SystemLogSourceEnum = builder.enumType('SystemLogSource', {
  values: Object.values(SystemLogSource),
})

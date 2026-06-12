import { builder } from '../../../builder'
import { ProjectStatus } from '@prisma/client'

export const ProjectStatusEnum = builder.enumType('ProjectStatus', {
  values: Object.values(ProjectStatus),
})

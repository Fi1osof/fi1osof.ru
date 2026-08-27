import { PrismaClient, RedirectPatternType } from '@prisma/client'

export interface CreateRedirectRuleParams {
  name: string
  pattern: string
  patternType: RedirectPatternType
  replacement: string
  statusCode?: number | null
  priority?: number | null
  enabled?: boolean | null
  comment?: string | null
}

export async function createRedirectRuleData(
  prisma: PrismaClient,
  params: CreateRedirectRuleParams,
) {
  const {
    name,
    pattern,
    patternType,
    replacement,
    statusCode,
    priority,
    enabled,
    comment,
  } = params

  return prisma.redirectRule.create({
    data: {
      name,
      pattern,
      patternType,
      replacement,
      statusCode: statusCode ?? 301,
      priority: priority ?? 0,
      enabled: enabled ?? true,
      comment,
    },
  })
}

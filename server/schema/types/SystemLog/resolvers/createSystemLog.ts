import { builder } from '../../../builder'
import { CreateSystemLogInput } from '../inputs'
import { detectRobot } from '../helpers/detectRobot'
import { matchRedirectRule } from '../helpers/matchRedirectRule'
import { findOrCreateIncident } from '../helpers/findOrCreateIncident'

const CreateSystemLogResult = builder.simpleObject('CreateSystemLogResult', {
  fields: (t) => ({
    id: t.id(),
    redirectTo: t.string({ nullable: true }),
    redirectStatusCode: t.int({ nullable: true }),
  }),
})

builder.mutationField('createSystemLog', (t) =>
  t.field({
    type: CreateSystemLogResult,
    args: {
      data: t.arg({ type: CreateSystemLogInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { prisma } = ctx
      const {
        level,
        source,
        message,
        stack,
        url,
        path,
        statusCode,
        method,
        userAgent,
        referer,
      } = args.data

      const logLevel = level
      const logSource = source

      const robotType = detectRobot(userAgent)

      let redirectRuleId: string | null = null
      let redirectTo: string | null = null
      let redirectStatusCode: number | null = null

      // Check redirect rules for HTTP errors (4xx)
      if (path && statusCode && statusCode >= 400 && statusCode < 500) {
        const rules = await prisma.redirectRule.findMany({
          where: { enabled: true },
          orderBy: { priority: 'asc' },
        })

        const match = matchRedirectRule(path, rules)
        if (match) {
          redirectRuleId = match.rule.id
          redirectTo = match.redirectTo
          redirectStatusCode = match.rule.statusCode
        }
      }

      // Group by incidents
      const incidentId = await findOrCreateIncident(prisma, {
        path,
        message,
        level: logLevel,
        statusCode,
      })

      const log = await prisma.systemLog.create({
        data: {
          level: logLevel,
          source: logSource,
          message,
          stack,
          url,
          path,
          statusCode,
          method,
          userAgent,
          robotType,
          referer,
          redirectRuleId,
          incidentId,
        },
      })

      return {
        id: log.id,
        redirectTo,
        redirectStatusCode,
      }
    },
  }),
)

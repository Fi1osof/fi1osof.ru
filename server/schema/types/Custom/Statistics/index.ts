import { forwardStatistics } from './forward'
import { builder } from 'server/schema/builder'

const Statistic = builder.simpleObject('SiteStatistic', {
  fields: (t) => ({
    id: t.string(),
    rootId: t.string({ nullable: true }),
    sequence: t.string(),
    userId: t.string({ nullable: true }),
    type: t.string(),
    status: t.string(),
    data: t.field({ type: 'Json' }),
  }),
})

builder.mutationField('logStats', (t) =>
  t.field({
    type: [Statistic],
    nullable: true,
    args: { data: t.arg({ type: 'Json', required: true }) },
    resolve: async (_root, { data }, ctx) => {
      const endpoint = process.env.AGENTS_CENTER_ENDPOINT
      const token = process.env.AGENTS_CENTER_TOKEN
      if (!endpoint || !token) {
        return null
      }
      const req = ctx.req
      const forwarded = req?.headers['x-forwarded-for']
      const ip =
        typeof forwarded === 'string'
          ? forwarded.split(',')[0].trim()
          : req && 'socket' in req
            ? req.socket.remoteAddress
            : null
      return forwardStatistics(endpoint, token, data, {
        userId: ctx.currentUser?.id ?? null,
        authenticated: Boolean(ctx.currentUser),
        ip,
        userAgent: req?.headers['user-agent'] ?? null,
        requestReferer: req?.headers.referer ?? null,
        receivedAt: new Date().toISOString(),
      })
    },
  }),
)

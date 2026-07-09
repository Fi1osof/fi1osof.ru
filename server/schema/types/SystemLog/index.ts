import { builder } from '../../builder'

import './inputs'
import './resolvers/createSystemLog'

import { SystemLogLevelEnum, SystemLogSourceEnum } from './types'

builder.prismaObject('SystemLog', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    level: t.field({
      type: SystemLogLevelEnum,
      resolve: (log) => log.level,
    }),
    source: t.field({
      type: SystemLogSourceEnum,
      resolve: (log) => log.source,
    }),
    message: t.exposeString('message'),
    stack: t.exposeString('stack', { nullable: true }),
    url: t.exposeString('url', { nullable: true }),
    path: t.exposeString('path', { nullable: true }),
    statusCode: t.exposeInt('statusCode', { nullable: true }),
    method: t.exposeString('method', { nullable: true }),
    userAgent: t.exposeString('userAgent', { nullable: true }),
    robotType: t.exposeString('robotType', { nullable: true }),
    ip: t.exposeString('ip', { nullable: true }),
    referer: t.exposeString('referer', { nullable: true }),
    redirectRuleId: t.exposeString('redirectRuleId', { nullable: true }),
    RedirectRule: t.relation('RedirectRule', { nullable: true }),
    incidentId: t.exposeString('incidentId', { nullable: true }),
    Incident: t.relation('Incident', { nullable: true }),
  }),
})

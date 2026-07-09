import { builder } from 'server/schema/builder'
import { RedirectPatternTypeEnum } from '../RedirectRule/types'
import { IncidentStatusEnum } from './types'

builder.prismaObject('Incident', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    title: t.exposeString('title'),
    pattern: t.exposeString('pattern', { nullable: true }),
    patternType: t.field({
      type: RedirectPatternTypeEnum,
      nullable: true,
      resolve: (incident) => incident.patternType,
    }),
    status: t.field({
      type: IncidentStatusEnum,
      resolve: (incident) => incident.status,
    }),
    resolution: t.exposeString('resolution', { nullable: true }),
    resolvedAt: t.expose('resolvedAt', { type: 'DateTime', nullable: true }),
    resolvedById: t.exposeString('resolvedById', { nullable: true }),
    ResolvedBy: t.relation('ResolvedBy', { nullable: true }),
    SystemLogs: t.relation('SystemLogs'),
  }),
})

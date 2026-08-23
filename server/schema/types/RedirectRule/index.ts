import { builder } from 'server/schema/builder'

import { RedirectPatternTypeEnum } from './types'

import './resolvers/createRedirectRule'

builder.prismaObject('RedirectRule', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    name: t.exposeString('name'),
    pattern: t.exposeString('pattern'),
    patternType: t.field({
      type: RedirectPatternTypeEnum,
      resolve: (rule) => rule.patternType,
    }),
    replacement: t.exposeString('replacement'),
    statusCode: t.exposeInt('statusCode'),
    priority: t.exposeInt('priority'),
    enabled: t.exposeBoolean('enabled'),
    comment: t.exposeString('comment', { nullable: true }),
    SystemLogs: t.relation('SystemLogs'),
  }),
})

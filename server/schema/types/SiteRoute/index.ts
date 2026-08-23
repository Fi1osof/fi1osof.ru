import { builder } from 'server/schema/builder'

import './resolvers/list'
import './resolvers/one'
import './resolvers/create'

builder.prismaObject('SiteRoute', {
  fields: (t) => ({
    id: t.exposeID('id', { nullable: false }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: false }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: false }),
    path: t.exposeString('path', { nullable: false }),
    slug: t.exposeString('slug', { nullable: false }),
    rank: t.exposeInt('rank', { nullable: false }),
    parentId: t.exposeID('parentId'),
    Parent: t.relation('Parent'),
    Children: t.relation('Children', {
      query: { orderBy: { createdAt: 'asc' } },
    }),
    kBConceptId: t.exposeString('kBConceptId'),
    KBConcept: t.relation('KBConcept'),
    createdById: t.exposeString('createdById'),
  }),
})

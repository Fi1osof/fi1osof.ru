import { builder } from '../../builder'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/concepts'
import './resolvers/concept'
import './resolvers/count'
import './resolvers/myConcepts'
import './resolvers/myConcept'
import './resolvers/createConcept'
import './resolvers/updateConcept'
import './resolvers/deleteConcept'
import './resolvers/upload'
import './resolvers/validateConcepts'

import { KBConceptOrderByInput, KBConceptWhereInput } from './inputs'
import { conceptsResolver } from './resolvers/concepts'
import { SiteRoute } from '@prisma/client'
import { KBConceptVisibilityEnum } from './types'
import { getFieldValueByLang } from './helpers/getFieldValueByLang'

// Export all types
export * from './inputs'

builder.prismaObject('KBConcept', {
  fields: (t) => ({
    id: t.exposeID('id', { nullable: false }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: false }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: false }),
    type: t.exposeString('type', { nullable: true }),
    name: t.string({
      nullable: false,
      resolve(source, _, ctx) {
        return getFieldValueByLang(source, 'name', ctx)
      },
    }),
    description: t.string({
      resolve(source, _, ctx) {
        return getFieldValueByLang(source, 'description', ctx)
      },
    }),
    intro: t.string({
      resolve(source, _, ctx) {
        return getFieldValueByLang(source, 'intro', ctx)
      },
    }),
    content: t.string({
      resolve(source, _, ctx) {
        return getFieldValueByLang(source, 'content', ctx)
      },
    }),
    code: t.exposeString('code'),
    image: t.exposeString('image'),
    path: t.exposeString('path'),
    mimetype: t.exposeString('mimetype'),
    quality: t.exposeFloat('quality'),
    data: t.expose('data', { type: 'Json', nullable: true }),
    createdById: t.exposeID('createdById', { nullable: false }),
    CreatedBy: t.relation('CreatedBy'),
    Labels: t.relation('Labels'),
    FactParticipations: t.relation('FactParticipations'),
    IdentityInputs: t.relation('IdentityInputs'),
    IdentityOutputs: t.relation('IdentityOutputs'),
    parentId: t.exposeID('parentId'),
    Parent: t.relation('Parent'),
    rootId: t.exposeID('rootId'),
    Root: t.relation('Root'),
    Children: t.prismaField({
      type: ['KBConcept'],
      args: {
        where: t.arg({ type: KBConceptWhereInput }),
        orderBy: t.arg({ type: KBConceptOrderByInput }),
        skip: t.arg.int(),
        take: t.arg.int(),
      },
      resolve: conceptsResolver,
    }),
    Descendants: t.relation('Descendants'),
    Files: t.relation('KBConceptFiles'),
    SiteRoute: t.relation('SiteRoute'),
    uri: t.string({
      nullable: false,
      resolve(source) {
        if (source.uri) {
          return source.uri
        }

        const SiteRoute =
          'SiteRoute' in source ? (source.SiteRoute as SiteRoute) : undefined

        return SiteRoute?.path || `/concepts/${source.id}`
      },
    }),
    visibility: t.field({
      type: KBConceptVisibilityEnum,
      resolve: (post) => post.visibility,
    }),
  }),
})

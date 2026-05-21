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
import { KBConceptOrderByInput, KBConceptWhereInput } from './inputs'
import { conceptsResolver } from './resolvers/concepts'

// Export all types
export * from './inputs'

builder.prismaObject('KBConcept', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.exposeString('type', { nullable: true }),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    content: t.exposeString('content', { nullable: true }),
    code: t.exposeString('code'),
    image: t.exposeString('image'),
    data: t.expose('data', { type: 'Json', nullable: true }),
    createdById: t.exposeID('createdById'),
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
  }),
})

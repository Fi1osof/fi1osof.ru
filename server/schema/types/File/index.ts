import { builder } from '../../builder'

import './resolvers/files'
import './resolvers/filesCount'
import './resolvers/file'
import './resolvers/singleUpload'
import './resolvers/update'

builder.prismaObject('File', {
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: true }),
    path: t.field({
      type: 'String',
      nullable: false,
      resolve: ({ path }) => {
        return path.replace(/^uploads\//, '')
      },
    }),
    filename: t.exposeString('filename'),
    name: t.exposeString('name', { nullable: true }),
    description: t.exposeString('description', { nullable: true }),
    content: t.exposeString('content', { nullable: true }),
    mimetype: t.exposeString('mimetype', { nullable: false }),
    // encoding: t.exposeString('encoding'),
    // size: t.exposeFloat('size'),
    rank: t.exposeInt('rank'),
    createdById: t.exposeString('CreatedBy', { nullable: true }),
    CreatedBy: t.relation('User', { nullable: true }),
    KBConcepts: t.relation('KBConceptFiles'),
  }),
})

import { builder } from '../../builder'

import './resolvers/files'
import './resolvers/filesCount'
import './resolvers/file'
import './resolvers/singleUpload'

builder.prismaObject('File', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: true }),
    path: t.field({
      type: 'String',
      nullable: true,
      resolve: ({ path }) => {
        // return parent.path ? `/uploads/${parent.path}` : null
        return path?.replace(/^uploads\//, '') || null
      },
    }),
    filename: t.exposeString('filename'),
    name: t.exposeString('name', { nullable: true }),
    mimetype: t.exposeString('mimetype'),
    encoding: t.exposeString('encoding'),
    // size: t.exposeFloat('size'),
    rank: t.exposeInt('rank'),
    createdById: t.exposeString('CreatedBy', { nullable: true }),
    CreatedBy: t.relation('User', { nullable: true }),
  }),
})

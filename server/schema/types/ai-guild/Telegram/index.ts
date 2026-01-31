import { builder } from '../../../builder'

builder.prismaObject('TelegramAccount', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    photo_url: t.exposeString('photo_url', { nullable: true }),
    username: t.exposeString('username', { nullable: true }),
    userId: t.exposeID('userId'),
  }),
})

import './resolvers/authViaTelegram'

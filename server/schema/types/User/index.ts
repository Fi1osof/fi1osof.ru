import { builder } from '../../builder'
import './inputs'

import { UserStatusEnum } from './types'

import './resolvers/users'
import './resolvers/usersCount'
import './resolvers/user'
import './resolvers/me'
import './resolvers/signup'
import './resolvers/signin'
import './resolvers/updateCurrentUser'
import './resolvers/updateUser'
import './resolvers/createReferrerToken'

// User object type
export const User = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: false }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: false }),
    email: t.string({
      nullable: true,
      resolve: (user, _args, ctx) =>
        ctx.currentUser?.id === user.id ? user.email : null,
    }),
    image: t.exposeString('image'),
    content: t.exposeString('content'),
    intro: t.exposeString('intro'),
    username: t.exposeString('username', { nullable: true }),
    fullname: t.exposeString('fullname', { nullable: true }),
    sudo: t.exposeBoolean('sudo', { nullable: true }),
    status: t.field({
      type: UserStatusEnum,
      resolve: (user) => user.status,
      nullable: false,
    }),
    EthAccount: t.relation('EthAccount', {
      async resolve(_query, parent, _args, context) {
        const { currentUser, prisma } = context

        return parent.id && parent.id === currentUser?.id
          ? prisma.ethAccount.findUnique({
              where: {
                userId: parent.id,
              },
            })
          : null
      },
    }),
    TelegramAccount: t.relation('TelegramAccount', {
      async resolve(_query, parent, _args, context) {
        const { currentUser, prisma } = context

        return parent.id && parent.id === currentUser?.id
          ? prisma.telegramAccount.findUnique({
              where: {
                userId: parent.id,
              },
            })
          : null
      },
    }),
    Balance: t.relation('Balance', {
      async resolve(_query, parent, _args, context) {
        const { currentUser, prisma } = context

        return parent.id && parent.id === currentUser?.id
          ? prisma.balance.findUnique({
              where: {
                userId: parent.id,
              },
            })
          : null
      },
    }),
  }),
})

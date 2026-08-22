import { Prisma } from '@prisma/client'
import { builder } from 'server/schema/builder'
import { SiteRouteCreateInput } from '../inputs'

builder.mutationField('createSiteRoute', (t) =>
  t.prismaField({
    type: 'SiteRoute',
    args: {
      data: t.arg({ type: SiteRouteCreateInput, required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Access denied')
      }

      const { rank, ...other } = args.data

      const data: Prisma.SiteRouteCreateInput = {
        ...other,
        rank: rank ?? undefined,
        createdById: currentUser.id,
      }

      const siteRoute = await prisma.siteRoute.create({
        data,
      })

      return siteRoute
    },
  }),
)

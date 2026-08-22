import { builder } from 'server/schema/builder'
import { buildSiteRouteWhere } from '../helpers'
import { SiteRouteWhereInput } from '../inputs'

builder.queryField('siteRoutes', (t) =>
  t.prismaField({
    type: ['SiteRoute'],
    args: {
      where: t.arg({ type: SiteRouteWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      return await ctx.prisma.siteRoute.findMany({
        ...query,
        where: buildSiteRouteWhere(args.where, ctx),
        orderBy: [{ rank: 'desc' }, { createdAt: 'desc' }],
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
      })
    },
  }),
)

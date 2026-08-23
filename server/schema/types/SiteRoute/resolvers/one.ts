import { builder } from 'server/schema/builder'
import { SiteRouteWhereUniqueInput } from '../inputs'

builder.queryField('siteRoute', (t) =>
  t.prismaField({
    type: 'SiteRoute',
    args: {
      where: t.arg({ type: SiteRouteWhereUniqueInput, required: true }),
    },
    resolve: async (_, _root, args, ctx) => {
      const { id, path, ...other } = args.where

      return await ctx.prisma.siteRoute.findUnique({
        where: {
          id: id ?? undefined,
          path: path ?? undefined,
          ...other,
        },
      })
    },
  }),
)

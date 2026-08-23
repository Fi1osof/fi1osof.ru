import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { SiteRouteWhereInput } from '../inputs'
import { buildStringFilterWhere } from '../../helpers/buildStringNullableFilterWhere'

type SiteRouteWhereArgs = typeof SiteRouteWhereInput.$inferInput

export function buildSiteRouteWhere(
  args?: SiteRouteWhereArgs | null,
  _ctx?: PrismaContext,
): Prisma.SiteRouteWhereInput {
  const { path, ...other } = args || {}

  const where: Prisma.SiteRouteWhereInput = {
    ...other,
    path: path ? buildStringFilterWhere(path) : undefined,
  }

  return where
}

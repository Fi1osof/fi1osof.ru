import { Prisma } from '@prisma/client'
import { GraphQLResolveInfo } from 'graphql'
import { builder } from '../../../builder'
import { KBConceptOrderByInput, KBConceptWhereInput } from '../inputs'
import { buildKBConceptWhere } from '../helpers/buildWhere'
import { PrismaContext } from 'server/context/interfaces'
import { InferArgs } from '../../helpers/types'

export const conceptsResolverArgs = (
  t: Parameters<Parameters<typeof builder.queryField>[1]>[0],
) => ({
  where: t.arg({ type: KBConceptWhereInput }),
  orderBy: t.arg({ type: KBConceptOrderByInput }),
  skip: t.arg.int(),
  take: t.arg.int(),
})

type ConceptsArgs = InferArgs<ReturnType<typeof conceptsResolverArgs>>

export const conceptsResolver = (
  query: { include?: Prisma.KBConceptInclude; select?: Prisma.KBConceptSelect },
  root: unknown,
  args: ConceptsArgs,
  ctx: PrismaContext,
  info: GraphQLResolveInfo,
) => {
  const where = buildKBConceptWhere(args.where, ctx)

  if (
    typeof root === 'object' &&
    root &&
    'id' in root &&
    typeof root.id === 'string'
  ) {
    switch (info.parentType.name) {
      case 'KBConcept':
        where.parentId = root.id

        break
    }
  }

  return ctx.prisma.kBConcept.findMany({
    ...query,
    where,
    skip: args.skip ?? undefined,
    take: args.take ?? undefined,
    orderBy: {
      createdAt: args.orderBy?.createdAt ?? undefined,
      name: args.orderBy?.name ?? undefined,
      type: args.orderBy?.type ?? undefined,
    },
  })
}

builder.queryField('concepts', (t) =>
  t.prismaField({
    type: ['KBConcept'],
    args: conceptsResolverArgs(t),
    resolve: conceptsResolver,
  }),
)

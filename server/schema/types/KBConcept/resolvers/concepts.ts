import { builder } from '../../../builder'
import { KBConceptOrderByInput, KBConceptsWhereInput } from '../inputs'

builder.queryField('concepts', (t) =>
  t.prismaField({
    type: ['KBConcept'],
    args: {
      where: t.arg({ type: KBConceptsWhereInput }),
      orderBy: t.arg({ type: KBConceptOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.kBConcept.findMany({
        ...query,
        where: {
          id: args.where?.ids?.length ? { in: args.where.ids } : undefined,
          type: args.where?.type ?? undefined,
          name: args.where?.name
            ? { contains: args.where.name, mode: 'insensitive' }
            : undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? undefined,
          name: args.orderBy?.name ?? undefined,
          type: args.orderBy?.type ?? undefined,
        },
      })
    },
  }),
)

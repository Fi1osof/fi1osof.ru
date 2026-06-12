import { builder } from '../../../../builder'
import { ProjectOrderByInput, ProjectWhereInput } from '../inputs'
import { buildProjectWhere } from '../helpers/buildProjectWhere'
import { Project } from '../types'

builder.queryField('projects', (t) =>
  t.field({
    type: [Project],
    args: {
      where: t.arg({ type: ProjectWhereInput }),
      orderBy: t.arg({
        type: ProjectOrderByInput,
        defaultValue: {
          updatedAt: 'desc',
        },
      }),
      take: t.arg.int({
        defaultValue: 100,
      }),
      skip: t.arg.int(),
    },
    resolve: async (_root, args, ctx) => {
      return await ctx.prisma.project.findMany({
        where: buildProjectWhere(args.where, ctx),
        orderBy: { createdAt: args.orderBy?.createdAt ?? 'desc' },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        include: {
          CreatedBy: true,
        },
      })
    },
  }),
)

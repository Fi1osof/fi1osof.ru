import { builder } from '../../../../builder'
import { ProjectWhereInput } from '../inputs'
import { buildProjectWhere } from '../helpers/buildProjectWhere'

builder.queryField('projectsCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: ProjectWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      return await ctx.prisma.project.count({
        where: buildProjectWhere(args.where, ctx),
      })
    },
  }),
)

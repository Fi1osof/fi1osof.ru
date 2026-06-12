import { builder } from '../../../../builder'
import { ProjectWhereUniqueInput } from '../inputs'
import { Project } from '../types'

builder.queryField('project', (t) =>
  t.field({
    type: Project,
    nullable: true,
    args: {
      where: t.arg({ type: ProjectWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!args.where.id) {
        throw new Error('ID проекта не указан')
      }

      const project = await ctx.prisma.project.findUnique({
        where: { id: args.where.id },
        include: {
          CreatedBy: true,
        },
      })

      if (!project) {
        return null
      }

      if (
        ctx.currentUser &&
        !ctx.currentUser.sudo &&
        project.createdById !== ctx.currentUser.id
      ) {
        throw new Error('Доступ запрещен')
      }

      return project
    },
  }),
)

import { builder } from '../../../../builder'
import { ProjectUpdateDataInput, ProjectWhereUniqueInput } from '../inputs'
import { Project } from '../types'

builder.mutationField('updateProject', (t) =>
  t.field({
    type: Project,
    args: {
      where: t.arg({ type: ProjectWhereUniqueInput, required: true }),
      data: t.arg({ type: ProjectUpdateDataInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Не авторизован')
      }

      if (!args.where.id) {
        throw new Error('ID проекта не указан')
      }

      const project = await ctx.prisma.project.findUnique({
        where: { id: args.where.id },
      })

      if (!project) {
        throw new Error('Проект не найден')
      }

      if (project.createdById !== ctx.currentUser.id && !ctx.currentUser.sudo) {
        throw new Error('Доступ запрещен')
      }

      const updatedProject = await ctx.prisma.project.update({
        where: { id: args.where.id },
        data: {
          name: args.data.name ?? undefined,
          description: args.data.description ?? undefined,
          intro: args.data.intro ?? undefined,
          content: args.data.content ?? undefined,
          image: args.data.image ?? undefined,
          commercial: args.data.commercial ?? undefined,
          status: args.data.status ?? undefined,
        },
        include: {
          CreatedBy: true,
        },
      })

      return updatedProject
    },
  }),
)

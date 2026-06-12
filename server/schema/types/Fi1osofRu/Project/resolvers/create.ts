import { builder } from '../../../../builder'
import { ProjectCreateInput } from '../inputs'
import { Project } from '../types'

builder.mutationField('createProject', (t) =>
  t.field({
    type: Project,
    args: {
      data: t.arg({ type: ProjectCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Не авторизован')
      }

      const { name, description, intro, content, image, commercial, status } =
        args.data

      const project = await prisma.project.create({
        data: {
          name,
          description: description ?? null,
          intro: intro ?? null,
          content: content ?? null,
          image: image ?? null,
          commercial,
          status: status ?? undefined,
          createdById: currentUser.id,
        },
        // include: {
        //   CreatedBy: true,
        // },
      })

      return project
    },
  }),
)

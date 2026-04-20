import { builder } from '../../../builder'
import { FileUpdateInput, FileWhereUniqueInput } from '../inputs'

builder.mutationField('updateFile', (t) =>
  t.prismaField({
    type: 'File',
    args: {
      where: t.arg({ type: FileWhereUniqueInput, required: true }),
      data: t.arg({ type: FileUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Unauthorized')
      }

      const { id, path } = args.where

      const existingFile = await prisma.file.findFirst({
        where: {
          id: id ?? undefined,
          path: path ?? undefined,
        },
      })

      if (!existingFile) {
        throw new Error('File not found')
      }

      if (existingFile.CreatedBy !== currentUser.id && !currentUser.sudo) {
        throw new Error('Can not edit alien file')
      }

      return prisma.file.update({
        ...query,
        where: { id: existingFile.id },
        data: args.data,
      })
    },
  }),
)

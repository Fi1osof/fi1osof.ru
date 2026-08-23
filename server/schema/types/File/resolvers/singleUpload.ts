import { builder } from 'server/schema/builder'
import { saveFile } from '../helpers/saveFile'

const SingleUploadInput = builder.inputType('SingleUploadInput', {
  fields: (t) => ({
    file: t.field({ type: 'Upload', required: true }),
    name: t.string(),
    directory: t.string(),
  }),
})

builder.mutationField('singleUpload', (t) =>
  t.prismaField({
    type: 'File',
    args: {
      data: t.arg({ type: SingleUploadInput, required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Unauthorized')
      }

      const { file: upload, directory, name } = args.data

      if (!upload) {
        throw new Error('Can not get file')
      }

      const { filename, mimetype, encoding, path, size, hash } = await saveFile(
        {
          upload,
          directory,
          userId: currentUser.id,
        },
      )

      return prisma.file.create({
        data: {
          filename,
          mimetype,
          encoding,
          path,
          size,
          hash,
          name: name ?? undefined,
          CreatedBy: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      })
    },
  }),
)

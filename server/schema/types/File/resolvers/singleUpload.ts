import { File } from '@prisma/client'
import { builder } from '../../../builder'
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

      let uploadResult

      try {
        uploadResult = await saveFile({
          upload,
          directory,
          userId: currentUser.id,
        })
      } catch (error) {
        // Drain request body to allow response to be sent
        const req = ctx.req
        if (req && 'socket' in req && req.socket) {
          req.socket.resume()
        }
        throw error
      }

      const { filename, mimetype, encoding, path, size, hash } = uploadResult

      let file: File | null | undefined

      if (hash && typeof hash === 'string') {
        file = await prisma.file.findUnique({
          where: {
            hash,
          },
        })
      }

      if (!file) {
        file = await prisma.file.create({
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
      }

      return file
    },
  }),
)

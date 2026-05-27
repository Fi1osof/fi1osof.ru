import { builder } from '../../../builder'
import fs from 'fs'
import { storeFS } from '../helpers/storeFS'

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

      const fileData = await (
        upload as unknown as {
          file: Promise<{
            createReadStream: () => fs.ReadStream
            filename: string
            mimetype: string
            encoding: string
          }>
        }
      ).file

      const { createReadStream, filename, mimetype, encoding } = fileData
      const stream: fs.ReadStream = createReadStream()

      const writeResult = await storeFS({
        userId: currentUser.id,
        stream,
        filename,
        directory,
      })

      if (!writeResult?.path) {
        throw new Error(`Can not upload file ${filename}`)
      }

      const stats = fs.statSync(writeResult.path)
      const { size } = stats

      return prisma.file.create({
        data: {
          filename,
          mimetype,
          encoding,
          path: writeResult.path.replace(/^\.\//, ''),
          size,
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

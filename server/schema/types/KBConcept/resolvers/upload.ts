import { builder } from '../../../builder'
import { saveFile } from '../../File/helpers/saveFile'
import { getFileTypeByMimetype } from '../helpers/getFileTypeByMimetype'

const KbConceptUploadInput = builder.inputType('KbConceptUploadInput', {
  fields: (t) => ({
    file: t.field({ type: 'Upload', required: true }),
    name: t.string(),
    directory: t.string(),
    type: t.string(),
  }),
})

builder.mutationField('uploadKbConcept', (t) =>
  t.prismaField({
    type: 'KBConcept',
    args: {
      data: t.arg({ type: KbConceptUploadInput, required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
      const { currentUser, prisma } = ctx

      if (!currentUser) {
        throw new Error('Unauthorized')
      }

      const { file: upload, directory, name, type: typeArg } = args.data

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

      let type = typeArg

      if (!type) {
        type = getFileTypeByMimetype(mimetype)
      }

      return prisma.kBConcept.create({
        data: {
          mimetype,
          path,
          name: name || filename,
          size,
          hash,
          type,
          CreatedBy: {
            connect: {
              id: currentUser.id,
            },
          },
          data: {
            filename,
            encoding,
          },
        },
      })

      // return prisma.file.create({
      //   data: {
      //     filename,
      //     mimetype,
      //     encoding,
      //     path,
      //     size,
      //     name: name ?? undefined,
      //     CreatedBy: {
      //       connect: {
      //         id: currentUser.id,
      //       },
      //     },
      //   },
      // })
    },
  }),
)

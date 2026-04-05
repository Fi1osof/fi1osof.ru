import { builder } from '../../../builder'
import path from 'path'
import fs from 'fs'

const { createWriteStream, unlink, mkdirSync } = fs

interface StoreResult {
  path: string
}

const storeFS = async ({
  stream,
  filename,
  directory,
}: {
  stream: fs.ReadStream
  filename: string | null | undefined
  directory: string | null | undefined
}): Promise<StoreResult> => {
  const baseDir = 'uploads'
  const baseDirAbsolute = path.resolve(baseDir)
  const uploadDir = path.join(baseDir, directory || '')

  mkdirSync(uploadDir, { recursive: true })

  const filenameUnique = `${new Date().getTime()}-${filename}`
  const filePath = path.join(uploadDir, filenameUnique)

  const resolved = path.resolve(filePath)
  const normalized = path.normalize(resolved)

  if (!normalized.startsWith(baseDirAbsolute)) {
    throw new Error('Wrong directory')
  }

  return new Promise((resolve, reject) => {
    const storedFileUrl = normalized
    const writeStream = createWriteStream(storedFileUrl)

    writeStream.on('finish', () => {
      resolve({
        path: filePath,
      })
    })

    writeStream.on('error', (error) => {
      unlink(storedFileUrl, () => {
        reject(error)
      })
    })

    stream
      .on('error', (error) => {
        writeStream.destroy(error)
      })
      .pipe(writeStream)
  })
}

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
        stream,
        filename,
        directory,
      }).catch((error) => {
        console.error('writeResult error', error)
        return null
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
          User: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      })
    },
  }),
)

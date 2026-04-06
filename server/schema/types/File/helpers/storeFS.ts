import path from 'path'
import fs from 'fs'

const { createWriteStream, unlink, mkdirSync } = fs

interface StoreResult {
  path: string
}

export const storeFS = async ({
  userId,
  stream,
  filename,
  directory,
}: {
  userId: string
  stream: fs.ReadStream
  filename: string | null | undefined
  directory: string | null | undefined
}): Promise<StoreResult> => {
  const baseDir = path.join('uploads', userId)
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

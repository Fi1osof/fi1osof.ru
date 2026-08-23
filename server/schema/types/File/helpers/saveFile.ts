import fs from 'fs'
import { storeFS } from '../helpers/storeFS'

type writeFileProps = {
  upload: unknown
  directory?: string | null
  userId: string
}

export async function saveFile({ upload, directory, userId }: writeFileProps) {
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
    userId,
    stream,
    filename,
    directory,
  })

  if (!writeResult?.path) {
    throw new Error(`Can not upload file ${filename}`)
  }

  const stats = fs.statSync(writeResult.path)
  const { size } = stats

  return {
    filename,
    mimetype,
    encoding,
    size,
    path: writeResult.path.replace(/^\.\//, ''),
    hash: writeResult.hash,
  }
}

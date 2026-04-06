import sharp, { Metadata, Sharp } from 'sharp'
import fs from 'fs'
import mime from 'mime-types'
import { RequestHandler } from 'express'
import { resolve } from 'path'

/**
 * Ресайз картинок
 */
export const imageResizerMiddleware: RequestHandler = async (
  req,
  res,
  _next,
) => {
  let src: string | undefined
  let type: string | undefined

  let match: RegExpMatchArray | null | undefined

  const srcPath = decodeURIComponent(req.originalUrl)

  if ((match = srcPath.match(/^\/images\/resized\/([^/]+)\/(.+)/))) {
    src = match[2].replace(/^\/?uploads\//, '')
    type = match[1]
  }

  if (src && type) {
    const path = resolve(`/uploads/`, src)

    const absPath = process.cwd() + path

    if (fs.existsSync(absPath)) {
      const mimetype = mime.lookup(absPath)

      const contentType = mimetype

      let data

      switch (contentType) {
        case 'image/svg+xml':
          break

        default: {
          const img = await sharp(absPath)

          const metadata = await img.metadata()

          data = await resizeImg(img, type, metadata)
            .then(async () => {
              if (!contentType) {
                res.status(500)
                res.send('Can not get contentType')
                return
              }

              return await img
                .withMetadata()
                .jpeg({ quality: 95 })
                .toBuffer()
                .catch((e) => {
                  console.error(e)

                  res.status(500)
                  res.send(e.message)
                })
            })
            .catch((error) => {
              res.status(500)
              res.send(error.message)
            })

          if (!data) {
            return
          }
        }
      }

      if (data) {
        res.status(200)

        if (contentType && typeof contentType === 'string') {
          res.contentType(contentType)
        }
        res.append('Cache-Control', `public, max-age=${1000000}`)
        res.send(data)
      } else {
        res.append('Cache-Control', `public, max-age=${1000000}`)
        res.sendFile(absPath)
      }

      return
    }
  }

  res.status(404).send('File not found')
}

async function resizeImg(img: Sharp, type: string, metadata: Metadata) {
  switch (type) {
    case 'origin':
      break

    case 'avatar':
      img.resize(200, 200)

      break

    case 'thumb':
      img.resize({
        width: 150,
        height: 150,
        fit: 'cover',
        position: sharp.gravity.north,
      })

      break

    case 'small':
      img.resize({
        width: 200,
        height: 160,
        fit: 'inside',
      })

      break

    case 'middle':
      img.resize({
        width: 900,
        height: 900,
        fit: 'inside',
      })

      break

    case 'big':
      img.resize({ fit: 'inside' })

      resizeMax(img, 1600, 1600, metadata)

      break

    default:
      throw new Error('Wrong image type')
  }

  return img
}

function resizeMax(
  img: Sharp,
  width: number,
  height: number,
  metadata: Metadata,
) {
  const { width: originWidth, height: originHeight } = metadata

  if (
    originWidth &&
    originHeight &&
    (width < originWidth || height < originHeight)
  ) {
    img
      .resize({ fit: 'inside' })
      .resize(width, height)
      .resize({ fit: 'inside' })
  }
}

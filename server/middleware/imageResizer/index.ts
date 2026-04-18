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

  const [pathPart, queryPart] = srcPath.split('?')
  const queryParams = new URLSearchParams(queryPart || '')
  const bgColor = queryParams.get('bg') // e.g. ?bg=white or ?bg=ff0000

  if ((match = pathPart.match(/^\/images\/resized\/([^/]+)\/(.+)/))) {
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
          if (type === 'origin') {
            break
          }
          let img = sharp(absPath)

          const metadata = await img.metadata()

          // Flatten PNG with alpha channel to specified background color
          if (metadata.hasAlpha && bgColor) {
            const background = parseBackgroundColor(bgColor)
            img = img.flatten({ background })
          }

          data = await resizeImg(img, type, metadata)
            .then(async () => {
              if (!contentType) {
                res.status(500)
                res.send('Can not get contentType')
                return
              }

              const pipeline = img.withMetadata()

              switch (contentType) {
                case 'image/png':
                  pipeline.png()
                  break
                case 'image/webp':
                  pipeline.webp({ quality: 95 })
                  break
                case 'image/gif':
                  pipeline.gif()
                  break
                default:
                  pipeline.jpeg({ quality: 95 })
              }

              return await pipeline.toBuffer().catch((e) => {
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
        withoutEnlargement: true,
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

/**
 * Parse background color from query parameter
 * Supports: 'white', 'black', hex ('ff0000', '#ff0000'), rgb ('255,255,255')
 */
function parseBackgroundColor(color: string): {
  r: number
  g: number
  b: number
} {
  const namedColors: Record<string, { r: number; g: number; b: number }> = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 255, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  }

  // Named color
  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()]
  }

  // Hex color (with or without #)
  const hex = color.replace(/^#/, '')
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    }
  }

  // RGB format: 255,255,255
  const rgbMatch = color.match(/^(\d{1,3}),(\d{1,3}),(\d{1,3})$/)
  if (rgbMatch) {
    return {
      r: Math.min(255, parseInt(rgbMatch[1])),
      g: Math.min(255, parseInt(rgbMatch[2])),
      b: Math.min(255, parseInt(rgbMatch[3])),
    }
  }

  // Default to white
  return { r: 255, g: 255, b: 255 }
}

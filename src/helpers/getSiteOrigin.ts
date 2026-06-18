import { IncomingMessage } from 'http'

export function getSiteOrigin(
  req: IncomingMessage | undefined,
): string | undefined {
  let origin: string | undefined

  if (req) {
    const { host } = req.headers

    const proto = req.headers['x-forwarded-proto'] || req.headers.proto

    if (host && proto) {
      origin = `${proto}://${host}`
    }
  } else if (typeof window !== 'undefined') {
    origin = window.location.origin
  }

  return origin
}

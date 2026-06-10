import { IncomingMessage } from 'http'

export function getSiteOrigin(
  req: IncomingMessage | undefined,
): string | undefined {
  let origin: string | undefined

  if (req) {
    const { host, 'x-forwarded-proto': proto } = req.headers

    if (host && proto) {
      origin = `${proto}://${host}`
    }
  } else if (typeof window !== 'undefined') {
    origin = window.location.origin
  }

  return origin
}

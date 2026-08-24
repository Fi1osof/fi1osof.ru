import { PrismaContext } from 'server/context/interfaces'
import {
  isLocale,
  Locale,
} from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'

export function getLocaleFromRequest(req: PrismaContext['req']): Locale {
  const pathname = req && 'originalUrl' in req ? req?.originalUrl : undefined

  let locale: Locale | undefined

  // Сначала проверяем локаль по суффиксу в path
  if (pathname && typeof pathname === 'string') {
    const match = pathname.match(/^\/api\/([a-z]{2,3})(\/|$)/)

    if (match) {
      const pathLocale = match[1]

      if (isLocale(pathLocale)) {
        locale = pathLocale
      }
    }
  }

  return locale || 'ru'
}

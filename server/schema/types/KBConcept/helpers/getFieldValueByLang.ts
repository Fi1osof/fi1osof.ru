import { PrismaContext } from 'server/context/interfaces'

import { JsonValue } from '@prisma/client/runtime/library'

export function getFieldValueByLang<
  T extends {
    en?: JsonValue
    vi?: JsonValue
  },
  K extends Exclude<keyof T, 'en' | 'vi'>,
>(source: T, field: K, { locale }: PrismaContext): T[K] {
  let value = source[field]

  if (locale && locale !== 'ru') {
    const translation = source[locale] as Partial<T> | undefined

    if (translation?.[field]) {
      value = translation[field]
    }
  }

  return value
}

export const getLocalePrefix = (locale: string): string => {
  return locale !== 'ru' ? `/${locale}` : ''
}

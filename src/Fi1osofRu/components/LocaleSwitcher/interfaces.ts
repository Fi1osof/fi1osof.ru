export const LOCALES = {
  ru: { label: 'Русский', flag: '🇷🇺' },
  en: { label: 'English', flag: '🇬🇧' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
  // de: { label: 'Deutsch', flag: '🇩🇪' },
  // pt: { label: 'Português', flag: '🇧🇷' },
  // es: { label: 'Español', flag: '🇪🇸' },
  // fr: { label: 'Français', flag: '🇫🇷' },
  // it: { label: 'Italiano', flag: '🇮🇹' },
  // pl: { label: 'Polski', flag: '🇵🇱' },
  // tr: { label: 'Türkçe', flag: '🇹🇷' },
  // zh: { label: '中文', flag: '🇨🇳' },
  // hi: { label: 'हिन्दी', flag: '🇮🇳' },
  // bn: { label: 'বাংলা', flag: '🇧🇩' },
  // th: { label: 'ไทย', flag: '🇹🇭' },
  // ja: { label: '日本語', flag: '🇯🇵' },
  // ko: { label: '한국어', flag: '🇰🇷' },
  // sw: { label: 'Kiswahili', flag: '🇰🇪' },
  // fil: { label: 'Filipino', flag: '🇵🇭' },
  // ms: { label: 'Bahasa Melayu', flag: '🇲🇾' },
} as const

export type Locale = keyof typeof LOCALES
export const LOCALE_CODES = Object.keys(LOCALES) as Locale[]

export type LocaleOption = {
  code: Locale
  label: string
  flag: string
  href: string
}

export const LOCALE_OPTIONS = Object.entries(LOCALES).map(([code, data]) => ({
  code: code as Locale,
  label: data.label,
  flag: data.flag,
}))

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALE_CODES as string[]).includes(value)
}

export const DEFAULT_LOCALE: Locale = 'ru'

/** Publication date, no time, formatted per locale conventions. */
export function formatDate(
  iso: string,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return iso
  }
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

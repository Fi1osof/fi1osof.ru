import React, { createContext, useContext, useMemo } from 'react'
import i18n, { Resource, ResourceLanguage, TFunction } from 'i18next'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import {
  DEFAULT_LOCALE,
  isLocale,
  Locale,
  LOCALE_CODES,
} from '../components/LocaleSwitcher/interfaces'
import { commonLexicon } from './commonLexicon'

export type LexiconObject = ResourceLanguage

export type LexiconDict = {
  [key in Locale]: ResourceLanguage
}

export type LexiconTranslate = TFunction

type LexiconContextValue = {
  locale: Locale
}

const LexiconContext = createContext<LexiconContextValue>({
  locale: DEFAULT_LOCALE,
})

const i18nInstance = i18n.createInstance()

const emptyResources = LOCALE_CODES.reduce((acc, code) => {
  acc[code] = { common: {} }
  return acc
}, {} as Resource)

i18nInstance.init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LOCALE_CODES,
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  resources: emptyResources,
})

type LexiconProviderProps = {
  children: React.ReactNode
}

export const LexiconProvider: React.FC<LexiconProviderProps> = ({
  children,
}) => {
  const router = useRouter()
  const locale: Locale = isLocale(router.locale)
    ? router.locale
    : DEFAULT_LOCALE

  useMemo(() => {
    if (i18nInstance.language !== locale) {
      i18nInstance.changeLanguage(locale)
    }

    if (commonLexicon) {
      for (const lang of Object.keys(commonLexicon)) {
        const resources = isLocale(lang) ? commonLexicon[lang] : undefined
        if (resources) {
          i18nInstance.addResourceBundle(lang, 'common', resources, true, true)
        }
      }
    }
  }, [locale])

  const contextValue = useMemo<LexiconContextValue>(
    () => ({ locale }),
    [locale],
  )

  return (
    <LexiconContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    </LexiconContext.Provider>
  )
}

export function useLexicon<T extends LexiconDict>(localLexicon?: T) {
  useContext(LexiconContext)
  const { t } = useTranslation()

  useMemo(() => {
    if (localLexicon) {
      for (const lang of Object.keys(localLexicon)) {
        const resources = isLocale(lang) ? localLexicon[lang] : undefined
        if (resources) {
          i18nInstance.addResourceBundle(lang, 'common', resources, true, true)
        }
      }
    }
  }, [localLexicon])

  return { t }
}

export function useLocale(): Locale {
  const { locale } = useContext(LexiconContext)
  return locale
}

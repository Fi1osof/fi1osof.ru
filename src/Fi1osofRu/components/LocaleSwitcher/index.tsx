import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  LocaleSwitcherStyled,
  LocaleSwitcherCheckboxStyled,
  LocaleSwitcherButtonStyled,
  LocaleSwitcherDropdownStyled,
  LocaleSwitcherItemStyled,
} from './styles'
import { Locale, LocaleOption, LOCALE_OPTIONS, isLocale } from './interfaces'

function buildLocaleHref(locale: Locale, pathname: string): string {
  const cleanPath = pathname.split('?')[0] || '/'

  return !locale || locale === 'ru'
    ? cleanPath
    : `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

export function LocaleSwitcher() {
  const router = useRouter()

  const locale: Locale = isLocale(router.locale)
    ? router.locale
    : isLocale(router.defaultLocale)
      ? router.defaultLocale
      : 'ru'

  const { pathname } = useMemo(() => {
    const pathname = router.asPath.split('?')[0]

    return { pathname }
  }, [router.asPath])

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const checkboxId = 'locale-switcher-toggle'

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen((prev) => !prev)
  }, [])

  const locales = useMemo<LocaleOption[]>(() => {
    return LOCALE_OPTIONS.map((l) => ({
      ...l,
      href: buildLocaleHref(l.code, pathname),
    }))
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLocale = locales.find((l) => l.code === locale) || locales[0]

  return (
    <LocaleSwitcherStyled ref={ref}>
      <LocaleSwitcherCheckboxStyled
        type="checkbox"
        id={checkboxId}
        checked={open}
        readOnly
      />
      <LocaleSwitcherButtonStyled
        as="label"
        htmlFor={checkboxId}
        onClick={handleToggle}
      >
        {currentLocale.flag}
      </LocaleSwitcherButtonStyled>
      <LocaleSwitcherDropdownStyled $open={open}>
        {locales.map((l) => (
          <LocaleSwitcherItemStyled
            key={l.code}
            href={l.href}
            $active={l.code === locale}
          >
            <span>{l.flag}</span>
            {l.label}
          </LocaleSwitcherItemStyled>
        ))}
      </LocaleSwitcherDropdownStyled>
    </LocaleSwitcherStyled>
  )
}

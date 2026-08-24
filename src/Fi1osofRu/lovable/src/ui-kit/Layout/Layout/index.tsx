import type React from 'react'
import { Header } from '../../Navigation/Header'
import { Footer } from '../../Navigation/Footer'
import {
  LayoutRootStyled,
  LayoutBodyStyled,
  LayoutRootBrendNameStyled,
  LayoutRootBrendNameFullStyled,
} from './styles'
import type { LayoutNavItem, LayoutProps } from './types'
import { useMemo } from 'react'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { layoutLexicon } from './lexicon'

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPath,
  // onNavigate,
  // brandName = '',
  brandName,
  brandTagline,
  className,
}) => {
  const { t } = useLexicon(layoutLexicon)

  const { navItems, nav, resolvedBrandName, resolvedBrandTagline } =
    useMemo(() => {
      const nav: LayoutNavItem[] = [
        {
          href: '/',
          id: 'now',
          label: t('nav.now'),
        },
        {
          href: '/projects',
          id: 'projects',
          label: t('nav.projects'),
        },
        {
          href: '/tasks',
          id: 'tasks',
          label: t('nav.tasks'),
        },
        // {
        //   href: '/posts',
        //   id: 'posts',
        //   label: t('nav.posts'),
        // },
        {
          href: '/worklogs',
          id: 'worklogs',
          label: t('nav.worklogs'),
        },
        {
          href: '/about',
          id: 'about',
          label: t('nav.about'),
        },
      ]

      const navItems = nav.map((item) => ({
        ...item,
        active: item.match
          ? item.match(currentPath)
          : item.href === currentPath,
      }))

      const brandName = (
        <LayoutRootBrendNameStyled>
          <span>{t('brand.name')}</span>
          <LayoutRootBrendNameFullStyled>
            {' '}
            · {t('brand.fullName')}
          </LayoutRootBrendNameFullStyled>
        </LayoutRootBrendNameStyled>
      )

      const brandTagline = t('brand.tagline')

      return {
        navItems,
        nav,
        resolvedBrandName: brandName,
        resolvedBrandTagline: brandTagline,
      }
    }, [currentPath, t])

  return (
    <LayoutRootStyled className={className}>
      <Header
        name={brandName || resolvedBrandName}
        tagline={brandTagline || resolvedBrandTagline}
        nav={navItems}
        // onNavigate={(item) => onNavigate(item.href)}
      />
      <LayoutBodyStyled>{children}</LayoutBodyStyled>
      <Footer
        nav={nav.map((n) => ({ id: n.id, label: n.label, href: n.href }))}
        // onNavigate={(item) => onNavigate(item.href)}
      />
    </LayoutRootStyled>
  )
}

import type React from 'react'
import { Header } from '../../Navigation/Header'
import { Footer } from '../../Navigation/Footer'
import { LayoutRootStyled, LayoutBodyStyled } from './styles'
import type { LayoutProps } from './types'

export const Layout: React.FC<LayoutProps> = ({
  children,
  nav,
  currentPath,
  // onNavigate,
  brandName = 'Николай Ланец · Fi1osof',
  brandTagline = 'инженер-исследователь · публичный журнал',
  className,
}) => {
  const navItems = nav.map((item) => ({
    ...item,
    active: item.match ? item.match(currentPath) : item.href === currentPath,
  }))

  return (
    <LayoutRootStyled className={className}>
      <Header
        name={brandName}
        tagline={brandTagline}
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

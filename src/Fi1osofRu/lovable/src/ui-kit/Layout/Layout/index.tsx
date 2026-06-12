import type React from 'react'
import { Header } from '../../Navigation/Header'
import { Footer } from '../../Navigation/Footer'
import {
  LayoutRootStyled,
  LayoutBodyStyled,
  LayoutRootBrendNameStyled,
  LayoutRootBrendNameFullStyled,
} from './styles'
import type { LayoutProps } from './types'

export const Layout: React.FC<LayoutProps> = ({
  children,
  nav,
  currentPath,
  // onNavigate,
  // brandName = '',
  brandName = (
    <LayoutRootBrendNameStyled>
      <span>Fi1osof</span>
      <LayoutRootBrendNameFullStyled>
        {' '}
        · Николай Ланец
      </LayoutRootBrendNameFullStyled>
    </LayoutRootBrendNameStyled>
  ),
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

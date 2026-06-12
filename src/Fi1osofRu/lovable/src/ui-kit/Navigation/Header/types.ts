export interface HeaderNavItem {
  id: string
  label: string
  href: string
  active?: boolean
}

export interface HeaderProps {
  name: React.ReactNode
  tagline: string
  nav: HeaderNavItem[]
  // onNavigate?: (item: HeaderNavItem) => void
}

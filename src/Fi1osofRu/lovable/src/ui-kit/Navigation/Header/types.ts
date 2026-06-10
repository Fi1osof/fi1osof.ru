export interface HeaderNavItem {
  id: string
  label: string
  href: string
  active?: boolean
}

export interface HeaderProps {
  name: string
  tagline: string
  nav: HeaderNavItem[]
  // onNavigate?: (item: HeaderNavItem) => void
}

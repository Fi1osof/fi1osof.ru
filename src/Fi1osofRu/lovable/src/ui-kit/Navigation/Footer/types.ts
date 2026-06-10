export interface FooterNavItem {
  id: string
  label: string
  href: string
}
export interface FooterProps {
  nav: FooterNavItem[]
  // onNavigate?: (item: FooterNavItem) => void
  year?: number
}

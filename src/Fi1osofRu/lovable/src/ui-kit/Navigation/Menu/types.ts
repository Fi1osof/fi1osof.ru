export interface MenuItem {
  id: string
  label: string
  href: string
}
export interface MenuProps {
  items: MenuItem[]
  // onNavigate?: (item: MenuItem) => void
}

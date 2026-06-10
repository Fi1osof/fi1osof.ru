export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
}
export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  // onNavigate?: (item: BreadcrumbItem) => void
}

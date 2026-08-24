import type { ReactNode } from 'react'

export interface LayoutNavItem {
  id: string
  label: string
  href: string
  match?: (path: string) => boolean
}

export interface LayoutProps {
  children: ReactNode
  currentPath: string
  // onNavigate: (href: string) => void
  brandName?: string
  brandTagline?: string
  className?: string
}

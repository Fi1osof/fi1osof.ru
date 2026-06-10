import type { ReactNode } from 'react'
export interface SidebarProps {
  children: ReactNode
  side?: 'left' | 'right'
  main: ReactNode
}

import type { ReactNode } from 'react'
export interface SectionProps {
  title?: string
  eyebrow?: string
  aside?: ReactNode
  children: ReactNode
}

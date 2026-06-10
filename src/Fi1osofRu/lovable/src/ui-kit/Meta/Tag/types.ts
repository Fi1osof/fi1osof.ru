import type { ReactNode } from 'react'
export interface TagProps {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'warm' | 'success' | 'warning'
}

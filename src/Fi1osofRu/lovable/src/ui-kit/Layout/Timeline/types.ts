import type { ReactNode } from 'react'

export interface TimelineItem {
  id: string
  eventAt?: string
  publishedAt?: string | null
  label?: string
  content: ReactNode | null | undefined
}

export interface TimelineProps {
  items: TimelineItem[]
}

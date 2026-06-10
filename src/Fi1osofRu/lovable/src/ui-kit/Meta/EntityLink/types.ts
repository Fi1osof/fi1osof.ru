import type { ReactNode } from 'react'
export interface EntityLinkProps {
  href: string
  children: ReactNode
  kind?: 'project' | 'task' | 'topic' | 'worklog'
  // onOpen?: (href: string) => void
}

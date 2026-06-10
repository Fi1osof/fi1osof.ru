import type { ActivityKind } from '../../Status/ActivityIndicator/types'
export interface ProjectCardProps {
  title: string
  description?: string
  status?: ActivityKind
  startedAt: string
  focus?: string[]
  image?: string
  href: string
  // onOpen?: (href: string) => void
}

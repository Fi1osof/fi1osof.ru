import type { ActivityKind } from '../../Status/ActivityIndicator/types'
export interface ProjectCardProps {
  title: string
  description?: string | null
  status?: ActivityKind | null
  startedAt: string
  focus?: string[]
  image?: string | null
  href: string
  // onOpen?: (href: string) => void
}

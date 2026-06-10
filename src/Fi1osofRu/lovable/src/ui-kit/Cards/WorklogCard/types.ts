export interface WorklogCardProps {
  taskTitle?: string
  body: string | null | undefined
  eventAt?: string
  publishedAt: string | null | undefined
  href: string
  // onOpen?: (href: string) => void
}

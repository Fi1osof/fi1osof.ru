export type ActivityKind = 'active' | 'research' | 'paused' | 'done'
export interface ActivityIndicatorProps {
  kind: ActivityKind
  label?: string
}

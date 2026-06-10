export interface GraphNodeProps {
  label: string
  x: number
  y: number
  kind?: 'project' | 'task' | 'topic'
}

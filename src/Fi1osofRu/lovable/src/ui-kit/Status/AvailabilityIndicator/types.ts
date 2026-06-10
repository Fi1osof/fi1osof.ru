export type AvailabilityStatus = 'available' | 'limited' | 'busy'
export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus
  label?: string
}

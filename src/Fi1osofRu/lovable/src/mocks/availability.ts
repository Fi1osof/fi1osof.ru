import type { AvailabilityStatus } from '../ui-kit/Status/AvailabilityIndicator/types'

export interface FixedCommitment {
  id: string
  title: string
  from: string
  to: string
  load: string
}

export interface Availability {
  fixed: FixedCommitment[]
  commercial: number
  personal: number
  status: AvailabilityStatus
}

export const availability: Availability = {
  fixed: [
    {
      id: 'c1',
      title: 'ИИ-курс',
      from: '01 июл 2026',
      to: '15 авг 2026',
      load: '2 ч / день',
    },
    {
      id: 'c2',
      title: 'Менторство',
      from: 'круглогодично',
      to: '—',
      load: '4 ч / неделя',
    },
  ],
  commercial: 2,
  personal: 3,
  status: 'limited',
}

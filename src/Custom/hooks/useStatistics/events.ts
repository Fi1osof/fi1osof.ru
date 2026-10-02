export const STATISTICS_EVENT = 'agents-center:statistics'

export type StatisticsEvent = {
  eventId: string
  data: Record<string, unknown>
}

/** Send application events through the single useStatistics queue. */
export function recordStatistics(
  eventId: string,
  data: Record<string, unknown>,
) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<StatisticsEvent>(STATISTICS_EVENT, {
        detail: { eventId, data },
      }),
    )
  }
}

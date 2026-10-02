import { GraphQLError } from 'graphql'
import { requestStatistics } from './response'

export async function forwardStatistics(
  endpoint: string,
  token: string,
  data: unknown,
  metadata: Record<string, unknown>,
) {
  if (
    !data ||
    typeof data !== 'object' ||
    !('events' in data) ||
    !Array.isArray(data.events) ||
    !data.events.length ||
    data.events.length > 100
  ) {
    throw new GraphQLError('Некорректный пакет событий статистики.')
  }
  // Validate the whole batch before saving any events.
  const events = data.events.map((event: unknown) => {
    if (
      !event ||
      typeof event !== 'object' ||
      Array.isArray(event) ||
      !('eventId' in event) ||
      typeof event.eventId !== 'string' ||
      !event.eventId.trim() ||
      !('timestamp' in event) ||
      typeof event.timestamp !== 'number' ||
      !Number.isSafeInteger(event.timestamp) ||
      event.timestamp < 0 ||
      event.timestamp > 8_640_000_000_000_000
    ) {
      throw new GraphQLError(
        'Событие должно содержать eventId и timestamp в миллисекундах Unix.',
      )
    }
    return { ...event, eventId: event.eventId, timestamp: event.timestamp }
  })
  const { events: _events, ...shared } = data
  const records: Awaited<ReturnType<typeof requestStatistics>>[] = []
  for (const event of events) {
    try {
      records.push(
        await requestStatistics(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            query: `mutation RecordStatistic($eventId: String!, $data: Json!) {
            recordStatistic(eventId: $eventId, data: $data, status: success) {
              id rootId sequence userId type status data
            }
          }`,
            variables: {
              eventId: event.eventId,
              data: {
                ...shared,
                ...event,
                ...metadata,
                occurredAt: new Date(event.timestamp).toISOString(),
              },
            },
          }),
        }),
      )
    } catch (error) {
      /**
       * Экспепшены кидаем только в дев-режиме
       */
      if (process.env.NODE_ENV === 'development') {
        throw new GraphQLError(
          error instanceof Error
            ? error.message
            : 'Не удалось сохранить событие статистики.',
          {
            extensions: {
              ...(error instanceof GraphQLError ? error.extensions : {}),
              acceptedEventCount: records.length,
            },
          },
        )
      }
    }
  }
  return records
}

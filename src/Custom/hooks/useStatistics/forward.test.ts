import { afterEach, describe, expect, it, vi } from 'vitest'
import { forwardStatistics } from '../../../../server/schema/types/Custom/Statistics/forward'

const saved = {
  id: '1',
  rootId: null,
  sequence: '1',
  userId: 'site',
  type: 'page.viewed',
  status: 'success',
  data: {},
}
afterEach(() => vi.unstubAllGlobals())

describe('forwarding statistics', () => {
  it('sends each event separately with shared metadata and UTC occurrence time', async () => {
    const send = vi.fn(
      async () =>
        new Response(JSON.stringify({ data: { recordStatistic: saved } })),
    )
    vi.stubGlobal('fetch', send)
    const events = [
      {
        eventId: 'page.viewed',
        timestamp: 1790971112104,
        url: 'https://example.com/a',
      },
      { eventId: 'button.clicked', timestamp: 1790971112204 },
    ]
    const records = await forwardStatistics(
      'http://center/api/',
      'secret',
      { visitorId: 'visitor', events },
      { ip: '127.0.0.1' },
    )
    expect(records).toHaveLength(2)
    expect(send).toHaveBeenCalledTimes(2)
    for (const [index, call] of send.mock.calls.entries()) {
      const args: unknown[] = call
      const options = args[1]
      if (
        !options ||
        typeof options !== 'object' ||
        !('body' in options) ||
        typeof options.body !== 'string'
      ) {
        throw new Error('Missing request')
      }
      const { variables } = JSON.parse(options.body)
      expect(variables.eventId).toBe(events[index].eventId)
      expect(variables.data.events).toBeUndefined()
      expect(variables.data).toMatchObject({
        ...events[index],
        visitorId: 'visitor',
        ip: '127.0.0.1',
        occurredAt: new Date(events[index].timestamp).toISOString(),
      })
    }
  })
  it('validates all events before forwarding', async () => {
    const send = vi.fn()
    vi.stubGlobal('fetch', send)
    await expect(
      forwardStatistics(
        'http://center/api/',
        'secret',
        {
          events: [
            { eventId: 'ok', timestamp: 1 },
            { eventId: 'bad', timestamp: 'yesterday' },
          ],
        },
        {},
      ),
    ).rejects.toThrow('timestamp')
    expect(send).not.toHaveBeenCalled()
  })
  it('reports the saved prefix so retries can omit successful events', async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { recordStatistic: saved } })),
      )
      .mockRejectedValueOnce(new Error('offline'))
    vi.stubGlobal('fetch', send)
    await expect(
      forwardStatistics(
        'http://center/api/',
        'secret',
        {
          events: [
            { eventId: 'first', timestamp: 1 },
            { eventId: 'second', timestamp: 2 },
            { eventId: 'third', timestamp: 3 },
          ],
        },
        {},
      ),
    ).rejects.toMatchObject({ extensions: { acceptedEventCount: 1 } })
    expect(send).toHaveBeenCalledTimes(2)
  })
})

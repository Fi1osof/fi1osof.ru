import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStatistics } from '.'

const routes = vi.hoisted(() => new Map<string, () => void>())
vi.mock('next/router', () => ({
  default: {
    events: {
      on: (name: string, handler: () => void) => routes.set(name, handler),
      off: (name: string) => routes.delete(name),
    },
  },
}))

const send = vi.fn(async () => ({
  ok: true,
  json: async () => ({ data: { logStats: { id: 'saved' } } }),
}))
const batches = () =>
  send.mock.calls.map((call) => {
    const args: unknown[] = call
    const options = args[1]
    if (
      !options ||
      typeof options !== 'object' ||
      !('body' in options) ||
      typeof options.body !== 'string'
    ) {
      throw new Error('Missing body')
    }
    return JSON.parse(options.body).variables.data
  })

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  send.mockClear()
  vi.stubGlobal('fetch', send)
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  routes.clear()
})

describe('visitor statistics', () => {
  it('waits for user initialization and persists the anonymous identity', async () => {
    const hook = renderHook(
      ({ loading }) => useStatistics(undefined, loading),
      { initialProps: { loading: true } },
    )
    expect(send).not.toHaveBeenCalled()
    await act(async () => hook.rerender({ loading: false }))
    const visitorId = localStorage.getItem('agents-center.visitor-id')
    expect(visitorId).toHaveLength(24)
    expect(batches()[0].visitorId).toBe(visitorId)
    hook.unmount()
    const second = renderHook(() => useStatistics(undefined, false))
    await act(async () => {
      //
    })
    expect(batches()[1].visitorId).toBe(visitorId)
    expect(batches()[1].tabId).not.toBe(batches()[0].tabId)
    second.unmount()
  })

  it('aggregates a burst of scroll events and captures delegated clicks', async () => {
    const hook = renderHook(() => useStatistics(undefined, false))
    await act(async () => {
      //
    })
    const button = document.createElement('button')
    button.innerHTML = '<span>Open</span>'
    document.body.append(button)
    for (let i = 0; i < 100; i++) {
      window.dispatchEvent(new Event('scroll'))
    }
    button.firstElementChild?.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    )
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000)
    })
    const events = batches()[1].events
    expect(
      events.filter(
        (event: { eventId: string }) => event.eventId === 'page.scrolled',
      ),
    ).toHaveLength(1)
    expect(
      events.find(
        (event: { eventId: string }) => event.eventId === 'button.clicked',
      ).target.label,
    ).toBe('Open')
    button.remove()
    hook.unmount()
  })

  it('records auth changes and route changes without resetting the visitor', async () => {
    const initialProps: { id: string | undefined } = { id: undefined }
    const hook = renderHook(
      ({ id }: { id: string | undefined }) => useStatistics(id, false),
      { initialProps },
    )
    await act(async () => {
      //
    })
    await act(async () => hook.rerender({ id: 'user-1' }))
    act(() => routes.get('routeChangeComplete')?.())
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000)
    })
    expect(batches()[1].events[0].eventId).toBe('identity.changed')
    expect(batches()[1].events[0].userId).toBe('user-1')
    expect(batches()[2].events[0].eventId).toBe('page.viewed')
    expect(batches()[1].visitorId).toBe(batches()[0].visitorId)
    hook.unmount()
  })

  it('retries failures on the timer and removes listeners on unmount', async () => {
    send.mockRejectedValueOnce(new Error('offline'))
    const hook = renderHook(() => useStatistics(undefined, false))
    await act(async () => {
      //
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000)
    })
    expect(send).toHaveBeenCalledTimes(2)
    expect(batches()[1].events).toEqual(batches()[0].events)
    hook.unmount()
    expect(routes.size).toBe(0)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000)
    })
    expect(send).toHaveBeenCalledTimes(2)
  })
})

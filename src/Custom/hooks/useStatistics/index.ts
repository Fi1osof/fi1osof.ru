import { useEffect, useRef } from 'react'
import Router from 'next/router'
import { createVisitorId, statisticsQuery, storedId } from './transport'

import { STATISTICS_EVENT } from './events'

type Event = Record<string, unknown>

export function useStatistics(userId: string | undefined, loading: boolean) {
  const identity = useRef({ userId, loading })
  const recordIdentity = useRef<(() => void) | null>(null)

  useEffect(() => {
    identity.current = { userId, loading }
    if (!loading) {
      recordIdentity.current?.()
    }
  }, [userId, loading])

  useEffect(() => {
    let visitorId: string | null = null
    const tabId = createVisitorId()
    let queue: Event[] = []
    let sending = false
    let lastIdentity: string | null = null
    let previousUrl = document.referrer
    let currentUrl = location.href
    let scrollTimer: ReturnType<typeof setTimeout> | undefined
    let scrollStart = window.scrollY

    const flush = async () => {
      if (sending || !queue.length) {
        return
      }
      sending = true
      // Split batches, never event text. Large individual events travel alone.
      const events: Event[] = []
      let batchBytes = 0
      while (queue.length && events.length < 30) {
        const eventBytes = new Blob([JSON.stringify(queue[0])]).size
        if (events.length && batchBytes + eventBytes > 48_000) {
          break
        }
        events.push(queue[0])
        queue.shift()
        batchBytes += eventBytes
      }
      let acceptedEventCount = 0
      try {
        let token: string | null = null
        try {
          token = localStorage.getItem('token')
        } catch {
          /* Storage may be blocked. */
        }
        const requestBody = JSON.stringify({
          query: statisticsQuery,
          variables: { data: { visitorId, tabId, events } },
        })
        const response = await fetch('/api/', {
          method: 'POST',
          credentials: 'same-origin',
          // Fetch keepalive has a 64 KiB body budget; use normal fetch for long text.
          keepalive: new Blob([requestBody]).size <= 48_000,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: requestBody,
        })
        const body: unknown = await response.json()
        if (
          body &&
          typeof body === 'object' &&
          'errors' in body &&
          Array.isArray(body.errors)
        ) {
          for (const error of body.errors) {
            const count: unknown = error?.extensions?.acceptedEventCount
            if (
              typeof count === 'number' &&
              Number.isInteger(count) &&
              count >= 0 &&
              count <= events.length
            ) {
              acceptedEventCount = count
              break
            }
          }
        }
        if (
          !response.ok ||
          !body ||
          typeof body !== 'object' ||
          'errors' in body
        ) {
          throw new Error('Statistics failed')
        }
      } catch {
        // Bounded best-effort retry; never block application interactions.
        queue = [...events.slice(acceptedEventCount), ...queue].slice(-100)
      } finally {
        sending = false
      }
    }
    const record = (eventId: string, data: Event = {}) => {
      if (identity.current.loading) {
        return
      }
      queue.push({
        eventId,
        timestamp: Date.now(),
        url: currentUrl,
        referrer: previousUrl,
        userId: identity.current.userId ?? null,
        authenticated: Boolean(identity.current.userId),
        language: navigator.language,
        viewport: { width: innerWidth, height: innerHeight },
        ...data,
      })
      queue = queue.slice(-100)
    }
    const identify = () => {
      if (!visitorId) {
        try {
          visitorId = localStorage.getItem('agents-center.visitor-id')
        } catch {
          /* Storage may be blocked. */
        }
        if (!visitorId && !identity.current.userId) {
          try {
            visitorId = storedId(localStorage, 'agents-center.visitor-id')
          } catch {
            visitorId = createVisitorId()
          }
        }
      }
      const next = identity.current.userId ?? ''
      if (lastIdentity === next) {
        return
      }
      record(lastIdentity === null ? 'page.viewed' : 'identity.changed', {
        title: document.title,
      })
      lastIdentity = next
      void flush()
    }
    recordIdentity.current = identify
    if (!identity.current.loading) {
      identify()
    }
    const finishScroll = () => {
      if (!scrollTimer) {
        return
      }
      clearTimeout(scrollTimer)
      scrollTimer = undefined
      record('page.scrolled', {
        fromY: scrollStart,
        toY: window.scrollY,
        pageHeight: document.documentElement.scrollHeight,
      })
      scrollStart = window.scrollY
    }
    const onScroll = () => {
      if (!scrollTimer) {
        scrollTimer = setTimeout(finishScroll, 1000)
      }
    }
    const onRoute = () => {
      finishScroll()
      previousUrl = currentUrl
      currentUrl = location.href
      scrollStart = window.scrollY
      record('page.viewed', { title: document.title })
    }
    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest(
              'a,button,[role="button"],input[type="submit"],input[type="button"]',
            )
          : null
      if (!target) {
        return
      }
      record(
        target instanceof HTMLAnchorElement ? 'link.clicked' : 'button.clicked',
        {
          target: {
            tag: target.tagName,
            id: target.id.slice(0, 200),
            label: (
              target.getAttribute('aria-label') ||
              target.textContent ||
              ''
            )
              .trim()
              .slice(0, 200),
            href:
              target instanceof HTMLAnchorElement
                ? target.href.slice(0, 4000)
                : null,
          },
        },
      )
    }
    const onStatistics = (event: globalThis.Event) => {
      if (!(event instanceof CustomEvent)) {
        return
      }
      const detail: unknown = event.detail
      if (
        !detail ||
        typeof detail !== 'object' ||
        !('eventId' in detail) ||
        typeof detail.eventId !== 'string' ||
        !('data' in detail) ||
        !detail.data ||
        typeof detail.data !== 'object' ||
        Array.isArray(detail.data)
      ) {
        return
      }
      record(detail.eventId, { ...detail.data })
    }
    const onLeave = () => {
      finishScroll()
      void flush()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        onLeave()
      }
    }
    const timer = setInterval(() => {
      void flush()
    }, 3000)
    Router.events.on('routeChangeComplete', onRoute)
    Router.events.on('hashChangeComplete', onRoute)
    window.addEventListener(STATISTICS_EVENT, onStatistics)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, true)
    window.addEventListener('pagehide', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      recordIdentity.current = null
      clearInterval(timer)
      Router.events.off('routeChangeComplete', onRoute)
      Router.events.off('hashChangeComplete', onRoute)
      window.removeEventListener(STATISTICS_EVENT, onStatistics)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('pagehide', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      onLeave()
    }
  }, [])
}

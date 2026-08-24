import { useMemo } from 'react'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { initializeApolloProps } from './interfaces'
import createApolloClient from './createApolloClient'
import { Locale } from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'

export * from './interfaces'

let apolloClient: ApolloClient | undefined

export function initializeApollo<
  P extends initializeApolloProps = initializeApolloProps,
>(props: P) {
  const { initialState, withWs, appContext, locale } = props

  const _apolloClient =
    apolloClient ??
    createApolloClient({
      withWs,
      appContext,
      locale,
    })

  if (initialState) {
    const existingCache = _apolloClient.extract() as NormalizedCacheObject
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  if (typeof window === 'undefined') {
    return _apolloClient
  }

  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
}

export function useApollo(
  initialState: NormalizedCacheObject | undefined,
  withWs: boolean,
  locale: Locale,
) {
  const store = useMemo(
    () =>
      initializeApollo({
        initialState,
        withWs,
        locale,
      }),
    [initialState, withWs, locale],
  )
  return store
}

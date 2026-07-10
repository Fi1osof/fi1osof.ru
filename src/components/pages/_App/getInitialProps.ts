import { initializeApollo } from 'src/gql/apolloClient'
import NextApp from 'next/app'

import {
  AppInitialProps,
  MainApp,
  NextPageContextCustom,
  PageProps,
  withWs,
} from './interfaces'
import { getSiteOrigin } from 'src/helpers/getSiteOrigin'
import {
  CreateSystemLogDocument,
  CreateSystemLogMutation,
  CreateSystemLogMutationVariables,
} from 'src/gql/generated/createSystemLog'
import { SystemLogLevel, SystemLogSource } from 'src/gql/generated'

export const getInitialProps: MainApp['getInitialProps'] = async (
  appContext,
) => {
  /**
   * In order to be able to assemble a common apollo state
   * from the application and then from pages and documents,
   * we pass the apollo client further into the application context.
   */
  const apolloClient = initializeApollo({
    withWs: withWs,
    appContext,
  })

  /**
   * Context passed further to the page
   */
  const ctx: NextPageContextCustom = {
    ...appContext.ctx,
    apolloClient,
  }

  const newAppContext = {
    ...appContext,
    ctx,
  }

  /**
   * Here page.getInitialProps() and then _document.getInitialProps() are called
   * Everything is assembled into the final appProps
   */

  const { pageProps, ...otherProps } =
    await NextApp.getInitialProps(newAppContext)

  let statusCode = (pageProps as PageProps | undefined)?.statusCode

  if (statusCode === undefined) {
    switch (ctx.pathname) {
      case '/404':
        statusCode = 404
        break
    }
  }

  /**
   * If running on the server side
   */
  if (statusCode && newAppContext.ctx.res) {
    newAppContext.ctx.res.statusCode = statusCode
  }

  const newProps: AppInitialProps = {
    ...otherProps,
    pageProps: {
      ...pageProps,
      statusCode,
      initialApolloState: apolloClient.cache.extract(),
      siteOrigin: getSiteOrigin(ctx.req),
    },
  }

  if (
    statusCode !== undefined &&
    statusCode !== 200 &&
    ctx.req?.url &&
    ctx.res
  ) {
    const req = ctx.req
    const res = ctx.res
    const url = req.url || ''
    const path = url.split('?')[0]

    const skip = [
      '/_next/static/chunks/pages/types.js.map',
      '/.well-known/appspecific/com.chrome.devtools.json',
    ].includes(url)

    if (!skip) {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const response = await apolloClient.mutate<
        CreateSystemLogMutation,
        CreateSystemLogMutationVariables
      >({
        mutation: CreateSystemLogDocument,
        variables: {
          data: {
            level: SystemLogLevel.ERROR,
            source: SystemLogSource.CLIENT,
            message: `HTTP ${statusCode}: ${path}`,
            url,
            path,
            statusCode,
            method: req.method,
            userAgent: req.headers['user-agent'],
            referer: req.headers.referer,
          },
        },
      })

      const result = response.data?.createSystemLog
      if (result?.redirectTo && result.redirectStatusCode) {
        res.writeHead(result.redirectStatusCode, {
          Location: result.redirectTo,
        })
        res.end()
      }
    }
  }

  return newProps
}

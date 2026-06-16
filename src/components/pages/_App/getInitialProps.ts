import { initializeApollo } from 'src/gql/apolloClient'
import NextApp, { AppInitialProps } from 'next/app'

import { MainApp, NextPageContextCustom, PageProps, withWs } from './interfaces'
import { getSiteOrigin } from 'src/helpers/seo/getSiteOrigin'

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

  const { statusCode } = pageProps as PageProps

  /**
   * If running on the server side
   */
  if (statusCode && newAppContext.ctx.res) {
    newAppContext.ctx.res.statusCode = statusCode
  }

  /**
   * Если страница была не найдена, проверяем ее на фрикоде,
   * так как много контента переехало в свое время туда.
   */
  if (
    (statusCode === 404 || ctx.pathname === '/404') &&
    ctx.req?.url &&
    ctx.res
  ) {
    const res = ctx.res

    const url = `https://freecode.academy${ctx.req.url}`

    const response = await fetch(url).catch(console.error)

    if (response?.ok) {
      res.writeHead(301, {
        Location: url,
      })
      res.end()
    }
  }

  const newProps: AppInitialProps = {
    ...otherProps,
    pageProps: {
      ...pageProps,
      statusCode,
      initialApolloState: apolloClient.cache.extract(),
      origin: getSiteOrigin(ctx.req),
    },
  }

  return newProps
}

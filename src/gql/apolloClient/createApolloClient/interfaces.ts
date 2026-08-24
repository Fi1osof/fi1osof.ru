import { AppContext } from 'next/app'
import { Locale } from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'

export type createApolloClientProps = {
  withWs: boolean

  /**
   * Application context. May be necessary for
   * forming correct headers when making API requests
   * on the server side in SSR mode
   */
  appContext?: AppContext

  locale: Locale
}

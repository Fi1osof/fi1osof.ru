import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { TimersDocument, useTimersQuery } from 'src/gql/generated'
import { TimersPageView } from './View'

export const TimersPage: Page = ({ siteOrigin }) => {
  const reponse = useTimersQuery()

  // TODO: Add pagination
  const timers = reponse.data?.timers ?? []

  return (
    <>
      <SeoHeaders
        title="Журнал"
        canonical={'/timers'}
        siteOrigin={siteOrigin}
      />

      <TimersPageView active={null} entries={timers} />
    </>
  )
}

TimersPage.getInitialProps = async ({ apolloClient }) => {
  await apolloClient.query({
    query: TimersDocument,
  })

  return {}
}

import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { timersLexicon } from './lexicon'
import {
  SortOrder,
  TimersDocument,
  TimersQuery,
  TimersQueryVariables,
  useTimersQuery,
} from 'src/gql/generated'
import { TimersPageView } from './View'

const variables: TimersQueryVariables = {
  orderBy: {
    createdAt: SortOrder.DESC,
  },
  take: 30,
}

export const TimersPage: Page = ({ siteOrigin }) => {
  const reponse = useTimersQuery({
    variables,
  })
  const { t } = useLexicon(timersLexicon)

  // TODO: Add pagination
  const timers = reponse.data?.timers ?? []

  return (
    <>
      <SeoHeaders
        title={t('seo.title')}
        description={t('seo.description')}
        canonical={'/timers'}
        siteOrigin={siteOrigin}
      />

      <TimersPageView active={null} entries={timers} />
    </>
  )
}

TimersPage.getInitialProps = async ({ apolloClient }) => {
  await apolloClient
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    .query<TimersQuery, TimersQueryVariables>({
      query: TimersDocument,
      variables,
    })

  return {}
}

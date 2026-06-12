import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { useTimersQuery } from 'src/gql/generated'
import { TimersPageView } from './View'

export const TimersPage: Page = () => {
  const reponse = useTimersQuery()

  const timers = reponse.data?.timers ?? []

  return (
    <>
      <SeoHeaders title="Журнал" />

      <TimersPageView active={null} entries={timers} />
    </>
  )
}

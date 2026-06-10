import { useMindLogQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { MindLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { MindLogPageStyled } from './styles'
import { getMindLogQueryVariables } from '../helpers'
import { mindLogPageGetInitialProps } from './mindLogPageGetInitialProps'
import { MindLogCard } from 'src/components/MindLogCard'

export const MindLogPage: Page<MindLogPageProps> = ({ mindLogId }) => {
  const variables = getMindLogQueryVariables(mindLogId)

  const response = useMindLogQuery({
    variables,
    skip: !mindLogId,
  })

  const mindLog = response.data?.response

  return (
    <>
      <SeoHeaders title={`Mind Log: ${mindLog?.type}`} noindex nofollow />
      {mindLog && (
        <MindLogPageStyled>
          <MindLogCard mindLog={mindLog} />
        </MindLogPageStyled>
      )}
    </>
  )
}

MindLogPage.getInitialProps = mindLogPageGetInitialProps

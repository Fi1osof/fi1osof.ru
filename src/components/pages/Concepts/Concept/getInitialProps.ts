import {
  ConceptDocument,
  ConceptQuery,
  ConceptQueryVariables,
} from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { ConceptPageProps } from './interfaces'
import { ApolloClient } from '@apollo/client'

type preloadConceptProps = {
  uri: string | undefined
  apolloClient: ApolloClient
}

export const preloadConcept = async ({
  uri,
  apolloClient,
}: preloadConceptProps): Promise<
  ReturnType<NonNullable<Page<ConceptPageProps>['getInitialProps']>>
> => {
  const concept = uri
    ? await apolloClient
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        .query<ConceptQuery, ConceptQueryVariables>({
          query: ConceptDocument,
          variables: {
            where: {
              uri,
            },
          },
        })
        .then((r) => r.data?.concept)
    : undefined

  return {
    uri,
    statusCode: !concept ? 404 : undefined,
  }
}

export const conceptPageGetInitialProps: Page<ConceptPageProps>['getInitialProps'] =
  async ({ apolloClient, asPath }) => {
    const uri = asPath?.split('?')[0]

    return preloadConcept({
      uri,
      apolloClient,
    })
  }

import {
  ConceptDocument,
  ConceptQuery,
  ConceptQueryVariables,
} from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { ConceptPageProps } from './interfaces'
import { ApolloClient } from '@apollo/client'

type preloadConceptProps = {
  conceptId: string | undefined
  apolloClient: ApolloClient
}

export const preloadConcept = async ({
  conceptId,
  apolloClient,
}: preloadConceptProps): Promise<
  ReturnType<NonNullable<Page<ConceptPageProps>['getInitialProps']>>
> => {
  const concept = conceptId
    ? await apolloClient
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        .query<ConceptQuery, ConceptQueryVariables>({
          query: ConceptDocument,
          variables: {
            where: {
              id: conceptId,
            },
          },
        })
        .then((r) => r.data?.concept)
    : undefined

  return {
    conceptId,
    statusCode: !concept ? 404 : undefined,
  }
}

export const conceptPageGetInitialProps: Page<ConceptPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const conceptId = typeof query.id === 'string' ? query.id : undefined

    return preloadConcept({
      conceptId,
      apolloClient,
    })
  }

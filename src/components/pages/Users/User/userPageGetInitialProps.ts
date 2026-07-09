import { Page } from '../../_App/interfaces'
import { UserPageProps } from './interfaces'
import { UserDocument, UserQuery, UserQueryVariables } from 'src/gql/generated'
import { getUserQueryVariables } from './helpers'

export const userPageGetInitialProps: Page<UserPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const userId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const variables = getUserQueryVariables(userId)

    const user = userId
      ? await apolloClient
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          .query<UserQuery, UserQueryVariables>({
            query: UserDocument,
            variables,
          })
          .then((r) => r.data?.object)
      : undefined

    return {
      userId,
      statusCode: !user ? 404 : undefined,
    }
  }

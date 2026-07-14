import { AppContextValue } from 'src/components/AppContext'
import { ConceptsConnectionQueryVariables } from 'src/gql/generated'

type getConceptsConnectionQueryVariablesProps =
  Partial<ConceptsConnectionQueryVariables> & {
    page: number
    take?: number
    currentUser: AppContextValue['user']
  }

export function getConceptsConnectionQueryVariables({
  page,
  take = 12,
  currentUser: _currentUser,
  ...other
}: getConceptsConnectionQueryVariablesProps): ConceptsConnectionQueryVariables {
  return {
    ...other,
    skip: (page - 1) * take,
    take,
  }
}

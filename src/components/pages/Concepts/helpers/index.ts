import { AppContextValue } from 'src/components/AppContext'
import {
  ConceptsConnectionQueryVariables,
  KbConceptVisibility,
} from 'src/gql/generated'

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
  where,
  ...other
}: getConceptsConnectionQueryVariablesProps): ConceptsConnectionQueryVariables & {
  take: number
} {
  const variable = {
    ...other,
    where: {
      visibility: KbConceptVisibility.PUBLIC,
      ...where,
    },
    skip: (page - 1) * take,
    take,
  }

  return variable
}

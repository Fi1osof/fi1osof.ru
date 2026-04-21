import { ConceptsConnectionQueryVariables } from 'src/gql/generated'

type getConceptsConnectionQueryVariablesProps =
  Partial<ConceptsConnectionQueryVariables> & {
    page: number
    take?: number
  }

export function getConceptsConnectionQueryVariables({
  page,
  take = 12,
  ...other
}: getConceptsConnectionQueryVariablesProps): ConceptsConnectionQueryVariables {
  return {
    ...other,
    skip: (page - 1) * take,
    take,
  }
}

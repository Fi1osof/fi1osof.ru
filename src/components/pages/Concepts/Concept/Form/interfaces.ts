import {
  CreateConceptMutationVariables,
  UpdateConceptMutationVariables,
} from 'src/gql/generated'

export type ConceptFormData =
  | UpdateConceptMutationVariables['data']
  | CreateConceptMutationVariables['data']

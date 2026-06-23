import { LlmModel } from 'src/gql/generated'

export function isModel(value: string | null | undefined): value is LlmModel {
  return value && Object.values<string>(LlmModel).includes(value) ? true : false
}

import { LlmImageGenerationAspectRatioInput } from 'src/gql/generated'

export function isAspectRatio(
  value: string | null | undefined,
): value is LlmImageGenerationAspectRatioInput {
  return value &&
    Object.values<string>(LlmImageGenerationAspectRatioInput).includes(value)
    ? true
    : false
}

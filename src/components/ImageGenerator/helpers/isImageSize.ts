import { LlmImageGenerationImageSizeInput } from 'src/gql/generated'

export function isImageSize(
  value: string | null | undefined,
): value is LlmImageGenerationImageSizeInput {
  return value &&
    Object.values<string>(LlmImageGenerationImageSizeInput).includes(value)
    ? true
    : false
}

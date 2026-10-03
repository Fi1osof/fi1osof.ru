import { LlmSpeechGenerationMutationVariables } from 'src/gql/generated'

export type TtsFormData = Pick<
  LlmSpeechGenerationMutationVariables['input'],
  'text' | 'prompt' | 'language' | 'model' | 'voice' | 'speed'
>

export enum LlmProvider {
  Local = 'Local',
  OpenRouter = 'OpenRouter',
}

export enum LlmModel {
  // Qwen 3.6 models
  // Qwen3_6_Flash = 'qwen/qwen3.6-flash',
  // Qwen3_6_Plus = 'qwen/qwen3.6-plus',
  // Qwen3_6_27B = 'qwen/qwen3.6-27b',
  // Qwen3_6_35B_A3B = 'qwen/qwen3.6-35b-a3b',

  // Qwen 3.5 models
  // Qwen3_5_Flash = 'qwen/qwen3.5-flash-02-23',
  // Qwen3_5_Plus = 'qwen/qwen3.5-plus-02-15',
  // Qwen3_5_9B = 'qwen/qwen3.5-9b',
  // Qwen3_5_27B = 'qwen/qwen3.5-27b',
  // Qwen3_5_35B_A3B = 'qwen/qwen3.5-35b-a3b',
  // Qwen3_5_122B_A10B = 'qwen/qwen3.5-122b-a10b',
  // Qwen3_5_397B_A17B = 'qwen/qwen3.5-397b-a17b',

  // Gemini 3.x models
  Gemini3_1_Flash_Lite_Preview = 'google/gemini-3.1-flash-lite-preview',
  Gemini3_Flash_Preview = 'google/gemini-3-flash-preview',

  // Gemini 2.5 models
  Gemini2_5_Flash = 'google/gemini-2.5-flash',
  Gemini2_5_Flash_Lite = 'google/gemini-2.5-flash-lite',

  // Image generation models
  Gemini3_1_Flash_Image = 'google/gemini-3.1-flash-image-preview',
  Gemini2_5_Flash_Image = 'google/gemini-2.5-flash-image',
}

export interface LLMClientOptions {
  provider: LlmProvider
  model: LlmModel
}

export interface LLMClientChatMessageContentText {
  type: 'text'
  text: string
}

export interface LLMClientChatMessageContentImage {
  type: 'image_url'
  image_url: {
    url: string
  }
}

export type LLMClientChatMessageContent =
  | string
  | (LLMClientChatMessageContentText | LLMClientChatMessageContentImage)[]

export enum LLMChatMessageRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
  tool = 'tool',
}

export interface LLMClientToolCallFunction {
  name: string
  arguments: string
}

export interface LLMClientToolCall {
  id: string
  type: 'function'
  function: LLMClientToolCallFunction
}

export interface LLMClientChatMessage {
  role: LLMChatMessageRole
  content?: LLMClientChatMessageContent | null
  tool_calls?: LLMClientToolCall[]
  tool_call_id?: string
}

export interface LLMClientCompletionRequest {
  prompt: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  stop?: string[]
}

export interface LLMClientChatCompletionRequest {
  messages: LLMClientChatMessage[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  stop?: string[]
}

// Raw API response types (snake_case)
export interface LLMClientRawUsagePromptTokensDetails {
  cached_tokens?: number
  cache_write_tokens?: number
  audio_tokens?: number
  video_tokens?: number
}

export interface LLMClientRawUsageCostDetails {
  upstream_inference_cost?: number
  upstream_inference_prompt_cost?: number
  upstream_inference_completions_cost?: number
}

export interface LLMClientRawUsageCompletionTokensDetails {
  reasoning_tokens?: number
  image_tokens?: number
  audio_tokens?: number
}

export interface LLMClientRawUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  cost?: number
  is_byok?: boolean
  prompt_tokens_details?: LLMClientRawUsagePromptTokensDetails
  cost_details?: LLMClientRawUsageCostDetails
  completion_tokens_details?: LLMClientRawUsageCompletionTokensDetails
}

export interface LLMClientRawCompletionResponse {
  id: string
  object: string
  created: number
  choices: {
    text: string
    index: number
    finish_reason: string
  }[]
  usage?: LLMClientRawUsage
}

export interface LLMClientRawChatCompletionResponse {
  id: string
  object: string
  created: number
  choices: {
    index: number
    message: LLMClientChatMessage
    finish_reason: string
  }[]
  usage?: LLMClientRawUsage
}

export interface LLMClientImageGenerationRequest {
  messages: LLMClientChatMessage[]
  modalities?: ('text' | 'image')[]
  image_config?: {
    aspect_ratio?: string
    image_size?: string
  }
}

export interface LLMClientRawImageGenerationResponse {
  id: string
  object: string
  created: number
  choices: {
    index: number
    message: {
      role: string
      content?: string | null
      images?: {
        image_url: {
          url: string
        }
      }[]
    }
    finish_reason: string
  }[]
  usage?: LLMClientRawUsage
  error?: {
    message: string
    code: number
  }
}

// Normalized response types (camelCase)
export interface LLMUsagePromptTokensDetails {
  cachedTokens?: number
  cacheWriteTokens?: number
  audioTokens?: number
  videoTokens?: number
}

export interface LLMUsageCostDetails {
  upstreamInferenceCost?: number
  upstreamInferencePromptCost?: number
  upstreamInferenceCompletionsCost?: number
}

export interface LLMUsageCompletionTokensDetails {
  reasoningTokens?: number
  imageTokens?: number
  audioTokens?: number
}

export interface LLMUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost?: number
  isByok?: boolean
  promptTokensDetails?: LLMUsagePromptTokensDetails
  costDetails?: LLMUsageCostDetails
  completionTokensDetails?: LLMUsageCompletionTokensDetails
}

export interface LLMChoiceMessage {
  role: string
  content?: string | null
  toolCalls?: {
    id: string
    type: string
    function: {
      name: string
      arguments: string
    }
  }[]
  toolCallId?: string
  images?: {
    imageUrl: string
  }[]
}

export interface LLMChoice {
  index: number
  message: LLMChoiceMessage
  finishReason: string
}

export interface LLMResponse {
  id: string
  object: string
  created: number
  choices: LLMChoice[]
  usage?: LLMUsage
  error?: {
    message: string
    code: number
  }
}

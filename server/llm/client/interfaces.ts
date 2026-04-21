export interface LLMClientLLMClientOptions {
  baseUrl?: string
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

export interface LLMClientUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface LLMClientCompletionResponse {
  id: string
  object: string
  created: number
  choices: {
    text: string
    index: number
    finish_reason: string
  }[]
  usage?: LLMClientUsage
}

export interface LLMClientChatCompletionResponse {
  id: string
  object: string
  created: number
  choices: {
    index: number
    message: LLMClientChatMessage
    finish_reason: string
  }[]
  usage?: LLMClientUsage
}

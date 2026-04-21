import { LLMChatMessageRole } from 'server/llm/client/interfaces'

export interface LLMCompletionInput {
  prompt: string
  maxTokens?: number
  temperature?: number
  topP?: number
  stop?: string[]
}

export interface LLMUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface LLMCompletionOutput {
  text: string
  finishReason: string
  usage?: LLMUsage
}

export interface LLMChatMessageContentTextInput {
  type: 'text'
  text: string
}

export interface LLMChatMessageContentImageInput {
  type: 'image_url'
  imageUrl: string
}

export type LLMChatMessageContentInput =
  | string
  | (LLMChatMessageContentTextInput | LLMChatMessageContentImageInput)[]

export interface LLMChatMessageInput {
  role: LLMChatMessageRole
  content: LLMChatMessageContentInput
}

export interface LLMChatCompletionInput {
  messages: LLMChatMessageInput[]
  maxTokens?: number
  temperature?: number
  topP?: number
  stop?: string[]
}

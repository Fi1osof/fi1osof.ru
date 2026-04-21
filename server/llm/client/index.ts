import {
  LLMClientChatCompletionRequest,
  LLMClientChatCompletionResponse,
  LLMClientCompletionRequest,
  LLMClientCompletionResponse,
} from './interfaces'

export class LLMClient {
  private readonly baseUrl: string | undefined

  constructor() {
    this.baseUrl = process.env.LLM_API_URL
  }

  private async fetch<T = unknown>(
    path: string,
    options: RequestInit,
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('LLM_API_URL is empty')
    }

    const url = `${this.baseUrl}${path}`
    const method = options.method ?? 'GET'

    const response = await fetch(url, options).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }

      throw error
    })

    if (!response.ok) {
      throw new Error(
        `[llmClient] ${method} ${url} failed with status ${response.status}`,
      )
    }

    return (await response.json()) as T
  }

  async completion(
    request: LLMClientCompletionRequest,
  ): Promise<LLMClientCompletionResponse> {
    return this.fetch<LLMClientCompletionResponse>('/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
  }

  async chatCompletion(
    request: LLMClientChatCompletionRequest,
  ): Promise<LLMClientChatCompletionResponse> {
    return this.fetch<LLMClientChatCompletionResponse>('/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
  }
}

export const llmClient = new LLMClient()

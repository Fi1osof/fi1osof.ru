import {
  LLMClientChatCompletionRequest,
  LLMClientCompletionRequest,
  LLMClientImageGenerationRequest,
  LLMClientRawCompletionResponse,
  LLMClientRawChatCompletionResponse,
  LLMClientRawImageGenerationResponse,
  LLMClientRawUsage,
  LLMClientChatMessage,
  LlmProvider,
  LlmModel,
  LLMResponse,
  LLMUsage,
  LLMChoice,
  LLMChoiceMessage,
  LLM_TOP_MODELS,
} from './interfaces'

interface ProviderConfig {
  baseUrl: string
  apiKey?: string
}

function getProviderConfig(provider: LlmProvider): ProviderConfig {
  switch (provider) {
    case LlmProvider.Local: {
      const baseUrl = process.env.LLM_LOCAL_API_URL
      if (!baseUrl) {
        throw new Error('LLM_LOCAL_API_URL is not configured')
      }
      return {
        baseUrl,
        apiKey: process.env.LLM_LOCAL_API_KEY,
      }
    }
    case LlmProvider.OpenRouter: {
      const baseUrl =
        process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
      if (!baseUrl) {
        throw new Error('OPENROUTER_API_URL is not configured')
      }
      const apiKey = process.env.OPENROUTER_API_KEY
      if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not configured')
      }
      return {
        baseUrl,
        apiKey,
      }
    }
  }
}

function mapUsage(raw: LLMClientRawUsage | undefined): LLMUsage | undefined {
  if (!raw) {
    return undefined
  }
  return {
    promptTokens: raw.prompt_tokens,
    completionTokens: raw.completion_tokens,
    totalTokens: raw.total_tokens,
    cost: raw.cost,
    isByok: raw.is_byok,
    promptTokensDetails: raw.prompt_tokens_details
      ? {
          cachedTokens: raw.prompt_tokens_details.cached_tokens,
          cacheWriteTokens: raw.prompt_tokens_details.cache_write_tokens,
          audioTokens: raw.prompt_tokens_details.audio_tokens,
          videoTokens: raw.prompt_tokens_details.video_tokens,
        }
      : undefined,
    costDetails: raw.cost_details
      ? {
          upstreamInferenceCost: raw.cost_details.upstream_inference_cost,
          upstreamInferencePromptCost:
            raw.cost_details.upstream_inference_prompt_cost,
          upstreamInferenceCompletionsCost:
            raw.cost_details.upstream_inference_completions_cost,
        }
      : undefined,
    completionTokensDetails: raw.completion_tokens_details
      ? {
          reasoningTokens: raw.completion_tokens_details.reasoning_tokens,
          imageTokens: raw.completion_tokens_details.image_tokens,
          audioTokens: raw.completion_tokens_details.audio_tokens,
        }
      : undefined,
    serverToolUseDetails: raw.server_tool_use_details
      ? {
          webSearchRequests: raw.server_tool_use_details.web_search_requests,
          toolCallsRequested: raw.server_tool_use_details.tool_calls_requested,
          toolCallsExecuted: raw.server_tool_use_details.tool_calls_executed,
        }
      : undefined,
  }
}

function mapChatMessage(msg: LLMClientChatMessage): LLMChoiceMessage {
  return {
    role: msg.role,
    content:
      typeof msg.content === 'string'
        ? msg.content
        : Array.isArray(msg.content)
          ? msg.content
              .filter((p) => p.type === 'text')
              .map((p) => (p as { text: string }).text)
              .join('')
          : null,
    toolCalls: msg.tool_calls?.map((tc) => ({
      id: tc.id,
      type: tc.type,
      function: {
        name: tc.function.name,
        arguments: tc.function.arguments,
      },
    })),
    toolCallId: msg.tool_call_id,
  }
}

export class LLMClient {
  private async fetch<T = unknown>(
    provider: LlmProvider,
    path: string,
    options: RequestInit,
  ): Promise<T> {
    const config = getProviderConfig(provider)
    const url = `${config.baseUrl}${path}`
    const method = options.method ?? 'GET'

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`
    }

    const CONNECT_TIMEOUT_MS = 15_000

    // TODO Add argument
    const RESPONSE_TIMEOUT_MS = 60_000

    const connectController = new AbortController()
    const connectTimer = setTimeout(
      () => connectController.abort(),
      CONNECT_TIMEOUT_MS,
    )

    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        headers,
        signal: connectController.signal,
      })
    } catch (error) {
      clearTimeout(connectTimer)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(
          `[llmClient] ${method} ${url} connection timeout (${CONNECT_TIMEOUT_MS}ms)`,
        )
      }
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
      throw error
    }
    clearTimeout(connectTimer)

    const responseController = new AbortController()
    const responseTimer = setTimeout(
      () => responseController.abort(),
      RESPONSE_TIMEOUT_MS,
    )

    if (!response.ok) {
      clearTimeout(responseTimer)
      const errorText = await response.text()
      throw new Error(
        `[llmClient] ${method} ${url} failed with status ${response.status}: ${errorText}`,
      )
    }

    // const result: T = await response.json()

    let text: string
    try {
      text = await Promise.race([
        response.text(),
        new Promise<never>((_, reject) => {
          responseController.signal.addEventListener('abort', () =>
            reject(
              new Error(
                `[llmClient] ${method} ${url} response timeout (${RESPONSE_TIMEOUT_MS}ms)`,
              ),
            ),
          )
        }),
      ])
    } finally {
      clearTimeout(responseTimer)
    }

    try {
      const result: T = JSON.parse(text)

      return result
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }

      throw new Error('Can not parse json')
    }
  }

  async completion(
    provider: LlmProvider,
    model: LlmModel,
    request: LLMClientCompletionRequest,
  ): Promise<LLMResponse> {
    if (provider === LlmProvider.OpenRouter) {
      throw new Error(
        'OpenRouter does not support /completions endpoint. Use chatCompletion instead.',
      )
    }

    const raw = await this.fetch<LLMClientRawCompletionResponse>(
      provider,
      '/completions',
      {
        method: 'POST',
        body: JSON.stringify({ ...request, model }),
      },
    )

    return {
      id: raw.id,
      object: raw.object,
      created: raw.created,
      choices: raw.choices.map(
        (c): LLMChoice => ({
          index: c.index,
          message: {
            role: 'assistant',
            content: c.text,
          },
          finishReason: c.finish_reason,
        }),
      ),
      usage: mapUsage(raw.usage),
    }
  }

  async chatCompletion(
    provider: LlmProvider,
    model: LlmModel,
    request: LLMClientChatCompletionRequest,
  ): Promise<LLMResponse> {
    const { providerOptions, ...requestBody } = request

    const body = {
      ...requestBody,
      model,
      ...(providerOptions ? { provider: providerOptions } : {}),
    }

    const raw = await this.fetch<LLMClientRawChatCompletionResponse>(
      provider,
      '/chat/completions',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )

    return {
      id: raw.id,
      object: raw.object,
      created: raw.created,
      choices: raw.choices.map(
        (c): LLMChoice => ({
          index: c.index,
          message: mapChatMessage(c.message),
          finishReason: c.finish_reason,
        }),
      ),
      usage: mapUsage(raw.usage),
    }
  }

  async imageGeneration(
    provider: LlmProvider,
    model: LlmModel,
    request: LLMClientImageGenerationRequest,
  ): Promise<LLMResponse> {
    if (
      LLM_TOP_MODELS.includes(model) &&
      process.env.LLM_ALLOW_TOP_MODELS !== 'true'
    ) {
      throw new Error('LLM top models is not allowed')
    }

    const raw = await this.fetch<LLMClientRawImageGenerationResponse>(
      provider,
      '/chat/completions',
      {
        method: 'POST',
        body: JSON.stringify({ ...request, model }),
      },
    ).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }

      throw error
    })

    if (raw.error) {
      throw new Error(raw.error.message || 'Image generation failed')
    }

    return {
      id: raw.id,
      object: raw.object,
      created: raw.created,
      choices: raw.choices.map(
        (c): LLMChoice => ({
          index: c.index,
          message: {
            role: c.message.role,
            content: c.message.content,
            images: c.message.images?.map((img) => ({
              imageUrl: img.image_url.url,
            })),
          },
          finishReason: c.finish_reason,
        }),
      ),
      usage: mapUsage(raw.usage),
    }
  }
}

export const llmClient = new LLMClient()

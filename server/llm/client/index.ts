/* eslint-disable no-console */
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

    const response = await fetch(url, {
      ...options,
      headers,
    }).catch((error) => {
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

    const result: T = await response.json()

    console.log('result', JSON.stringify(result, null, 2))

    return result
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
    const raw = await this.fetch<LLMClientRawChatCompletionResponse>(
      provider,
      '/chat/completions',
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
    const raw = await this.fetch<LLMClientRawImageGenerationResponse>(
      provider,
      '/chat/completions',
      {
        method: 'POST',
        body: JSON.stringify({ ...request, model }),
      },
    )

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

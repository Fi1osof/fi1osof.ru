import {
  LLMClientSpeechGenerationRequest,
  LLMSpeechResponse,
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

  async speechGeneration(
    provider: LlmProvider,
    model: string,
    request: LLMClientSpeechGenerationRequest,
  ): Promise<LLMSpeechResponse> {
    if (!model.trim() || !request.text.trim()) {
      throw new Error('TTS model and text must not be empty')
    }
    if (
      request.speed !== undefined &&
      (!Number.isFinite(request.speed) ||
        request.speed < 0.25 ||
        request.speed > 4)
    ) {
      throw new Error('TTS speed must be between 0.25 and 4')
    }
    const isGeminiTts =
      provider === LlmProvider.OpenRouter &&
      model === 'google/gemini-3.1-flash-tts-preview'
    const format = request.responseFormat ?? (isGeminiTts ? 'wav' : 'mp3')
    if (isGeminiTts && format !== 'pcm' && format !== 'wav') {
      throw new Error(
        'Gemini TTS supports pcm or wav output; MP3 encoding is not available',
      )
    }
    // OpenRouter Gemini accepts only PCM; WAV is packaged locally, without transcoding.
    const upstreamFormat = isGeminiTts ? 'pcm' : format
    const mimeTypes = {
      mp3: 'audio/mpeg',
      pcm: 'audio/pcm',
      wav: 'audio/wav',
      opus: 'audio/ogg',
      aac: 'audio/aac',
      flac: 'audio/flac',
    }
    if (!(format in mimeTypes)) {
      throw new Error('Unsupported TTS format')
    }
    if (
      provider === LlmProvider.OpenRouter &&
      !['mp3', 'pcm'].includes(upstreamFormat)
    ) {
      throw new Error('OpenRouter TTS supports mp3 and pcm')
    }
    const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null && !Array.isArray(value)
    if (
      request.providerOptions !== undefined &&
      !isObject(request.providerOptions)
    ) {
      throw new Error('TTS providerOptions must be an object')
    }
    let providerOptions = request.providerOptions as
      | Record<string, unknown>
      | undefined
    const instructions = [
      request.language
        ? `Speak in the following language: ${request.language}.`
        : undefined,
      request.prompt,
    ]
      .filter(Boolean)
      .join('\n')
    let input = request.text
    if (provider === LlmProvider.OpenRouter && instructions) {
      // Gemini TTS accepts delivery instructions in its text input:
      // https://ai.google.dev/gemini-api/docs/speech-generation
      if (isGeminiTts) {
        input = `${instructions}\nRead only the following text aloud, without translating it or reading these instructions:\n\n${request.text}`
      } else if (model.startsWith('openai/')) {
        const options = providerOptions?.options
        if (options !== undefined && !isObject(options)) {
          throw new Error('TTS providerOptions.options must be an object')
        }
        const openai = options?.openai
        if (openai !== undefined && !isObject(openai)) {
          throw new Error(
            'TTS providerOptions.options.openai must be an object',
          )
        }
        providerOptions = {
          ...providerOptions,
          options: { ...options, openai: { ...openai, instructions } },
        }
      } else {
        throw new Error(
          'TTS prompt/language on OpenRouter require a supported Gemini TTS or OpenAI model; use providerOptions for other providers',
        )
      }
    }
    const config = getProviderConfig(provider)
    const url = `${config.baseUrl.replace(/\/$/, '')}/audio/speech`
    const controller = new AbortController()
    // Keep the same signal active while reading the binary body as well.
    const timer = setTimeout(() => controller.abort(), 120_000)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey
            ? { Authorization: `Bearer ${config.apiKey}` }
            : {}),
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          input,
          voice: request.voice,
          response_format: upstreamFormat,
          speed: isGeminiTts ? undefined : request.speed,
          ...(provider === LlmProvider.Local
            ? {
                instructions: request.prompt,
                language: request.language,
              }
            : {}),
          ...(providerOptions ? { provider: providerOptions } : {}),
        }),
      })
      if (!response.ok) {
        throw new Error(
          `[llmClient] TTS failed with status ${response.status}: ${await response.text()}`,
        )
      }
      const contentType = response.headers
        .get('content-type')
        ?.split(';')[0]
        .trim()
        .toLowerCase()
      if (
        contentType &&
        !contentType.startsWith('audio/') &&
        contentType !== 'application/octet-stream'
      ) {
        throw new Error(`TTS returned unexpected content type: ${contentType}`)
      }
      let audio = Buffer.from(await response.arrayBuffer())
      if (!audio.length) {
        throw new Error('TTS returned empty audio')
      }
      if (isGeminiTts && format === 'wav') {
        if (audio.length % 2 !== 0) {
          throw new Error('Gemini TTS returned incomplete 16-bit PCM audio')
        }
        if (
          contentType &&
          !['audio/pcm', 'audio/l16', 'application/octet-stream'].includes(
            contentType,
          )
        ) {
          throw new Error(
            `Gemini TTS returned unexpected PCM content type: ${contentType}`,
          )
        }
        // Official Gemini sample: signed little-endian PCM, 24 kHz, 16-bit mono.
        // https://ai.google.dev/gemini-api/docs/speech-generation
        const header = Buffer.alloc(44)
        header.write('RIFF', 0)
        header.writeUInt32LE(36 + audio.length, 4)
        header.write('WAVE', 8)
        header.write('fmt ', 12)
        header.writeUInt32LE(16, 16)
        header.writeUInt16LE(1, 20)
        header.writeUInt16LE(1, 22)
        header.writeUInt32LE(24000, 24)
        header.writeUInt32LE(48000, 28)
        header.writeUInt16LE(2, 32)
        header.writeUInt16LE(16, 34)
        header.write('data', 36)
        header.writeUInt32LE(audio.length, 40)
        audio = Buffer.concat([header, audio])
      }
      const mimeType =
        isGeminiTts && format === 'wav'
          ? 'audio/wav'
          : contentType?.startsWith('audio/')
            ? contentType
            : mimeTypes[format]
      return {
        id: response.headers.get('x-generation-id') ?? undefined,
        audioUrl: `data:${mimeType};base64,${audio.toString('base64')}`,
        mimeType,
        format,
      }
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error('TTS request timed out (120000ms)')
      }
      throw error
    } finally {
      clearTimeout(timer)
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

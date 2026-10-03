// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { LLMClient } from '../../../server/llm/client'
import { LlmProvider } from '../../../server/llm/client/interfaces'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

it('maps instructions and language, preserves provider options and returns binary audio', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-key')
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(new Uint8Array([0, 255, 1]), {
      headers: { 'content-type': 'audio/mpeg', 'x-generation-id': 'gen-test' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  const result = await new LLMClient().speechGeneration(
    LlmProvider.OpenRouter,
    'openai/gpt-4o-mini-tts-2025-12-15',
    {
      text: 'Привет',
      prompt: 'Read slowly',
      language: 'ru',
      voice: 'alloy',
      speed: 0.8,
      providerOptions: {
        order: ['openai'],
        options: { openai: { custom: true }, other: { value: 1 } },
      },
    },
  )
  const body = JSON.parse(fetchMock.mock.calls[0][1].body)
  expect(fetchMock.mock.calls[0][0]).toMatch(/\/audio\/speech$/)
  expect(body).toMatchObject({
    input: 'Привет',
    response_format: 'mp3',
    voice: 'alloy',
    speed: 0.8,
    provider: {
      order: ['openai'],
      options: {
        openai: {
          custom: true,
          instructions: 'Speak in the following language: ru.\nRead slowly',
        },
        other: { value: 1 },
      },
    },
  })
  expect(result).toEqual({
    id: 'gen-test',
    audioUrl: 'data:audio/mpeg;base64,AP8B',
    mimeType: 'audio/mpeg',
    format: 'mp3',
  })
})

it('rejects unsupported hints and invalid speed before issuing a request', async () => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  const client = new LLMClient()
  await expect(
    client.speechGeneration(LlmProvider.OpenRouter, 'other/tts', {
      text: 'Hello',
      language: 'en',
    }),
  ).rejects.toThrow('require a supported Gemini TTS or OpenAI model')
  await expect(
    client.speechGeneration(LlmProvider.Local, 'tts', {
      text: 'Hello',
      speed: 0,
    }),
  ).rejects.toThrow('speed')
  expect(fetchMock).not.toHaveBeenCalled()
})

it.each([
  [new Response('upstream error', { status: 400 }), 'status 400'],
  [
    new Response('{}', { headers: { 'content-type': 'application/json' } }),
    'content type',
  ],
  [
    new Response(new Uint8Array(), {
      headers: { 'content-type': 'audio/mpeg' },
    }),
    'empty audio',
  ],
])(
  'rejects unsuccessful or invalid audio responses',
  async (response, message) => {
    vi.stubEnv('LLM_LOCAL_API_URL', 'http://localhost:1234/v1')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
    await expect(
      new LLMClient().speechGeneration(LlmProvider.Local, 'tts', {
        text: 'Hello',
      }),
    ).rejects.toThrow(message)
  },
)

it('sends Gemini prompt and language in the synthesis input with its own voice', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-key')
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(new Uint8Array([1, 0]), {
      headers: { 'content-type': 'audio/pcm' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  await new LLMClient().speechGeneration(
    LlmProvider.OpenRouter,
    'google/gemini-3.1-flash-tts-preview',
    {
      text: 'Привет',
      prompt: 'Speak softly',
      language: 'ru',
      voice: 'Kore',
    },
  )
  const body = JSON.parse(fetchMock.mock.calls[0][1].body)
  expect(body.model).toBe('google/gemini-3.1-flash-tts-preview')
  expect(body.voice).toBe('Kore')
  expect(body.input).toBe(
    'Speak in the following language: ru.\nSpeak softly\nRead only the following text aloud, without translating it or reading these instructions:\n\nПривет',
  )
  expect(body.provider).toBeUndefined()
})

it('keeps Gemini text unchanged when no instructions are supplied', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-key')
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(new Uint8Array([1, 0]), {
      headers: { 'content-type': 'audio/pcm' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  await new LLMClient().speechGeneration(
    LlmProvider.OpenRouter,
    'google/gemini-3.1-flash-tts-preview',
    {
      text: 'Привет',
      voice: 'Kore',
    },
  )
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).input).toBe('Привет')
})

it('requests Gemini PCM and wraps it in a valid 24kHz 16-bit mono WAV', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-key')
  const pcm = Buffer.from([0, 0, 255, 127, 0, 128])
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(pcm, {
      headers: { 'content-type': 'audio/pcm', 'x-generation-id': 'gen-pcm' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  const result = await new LLMClient().speechGeneration(
    LlmProvider.OpenRouter,
    'google/gemini-3.1-flash-tts-preview',
    { text: 'Привет', voice: 'Kore', speed: 1 },
  )
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).response_format).toBe(
    'pcm',
  )
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).speed).toBeUndefined()
  expect(result).toMatchObject({
    mimeType: 'audio/wav',
    format: 'wav',
    id: 'gen-pcm',
  })
  const wav = Buffer.from(result.audioUrl.split(',')[1], 'base64')
  expect(wav.toString('ascii', 0, 4)).toBe('RIFF')
  expect(wav.readUInt32LE(4)).toBe(wav.length - 8)
  expect(wav.toString('ascii', 8, 12)).toBe('WAVE')
  expect(wav.readUInt16LE(20)).toBe(1)
  expect(wav.readUInt16LE(22)).toBe(1)
  expect(wav.readUInt32LE(24)).toBe(24000)
  expect(wav.readUInt32LE(28)).toBe(48000)
  expect(wav.readUInt16LE(32)).toBe(2)
  expect(wav.readUInt16LE(34)).toBe(16)
  expect(wav.readUInt32LE(40)).toBe(pcm.length)
  expect(wav.subarray(44)).toEqual(pcm)
})

it('preserves raw PCM when explicitly requested', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-key')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(new Uint8Array([1, 0]), {
        headers: { 'content-type': 'audio/pcm' },
      }),
    ),
  )
  const result = await new LLMClient().speechGeneration(
    LlmProvider.OpenRouter,
    'google/gemini-3.1-flash-tts-preview',
    { text: 'Привет', responseFormat: 'pcm' },
  )
  expect(result).toMatchObject({
    format: 'pcm',
    mimeType: 'audio/pcm',
    audioUrl: 'data:audio/pcm;base64,AQA=',
  })
})

it('rejects Gemini MP3 before sending a paid request', async () => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  await expect(
    new LLMClient().speechGeneration(
      LlmProvider.OpenRouter,
      'google/gemini-3.1-flash-tts-preview',
      { text: 'Привет', responseFormat: 'mp3' },
    ),
  ).rejects.toThrow('MP3 encoding is not available')
  expect(fetchMock).not.toHaveBeenCalled()
})

import { builder } from 'server/schema/builder'
import { PrismaContext } from 'server/context/interfaces'
import { InferArgs } from '../../helpers/types'
import { LlmProviderEnum } from '../types'

const LLMSpeechFormat = builder.enumType('LLMSpeechFormat', {
  values: ['mp3', 'pcm', 'wav', 'opus', 'aac', 'flac'] as const,
})

const LLMSpeechGenerationInput = builder.inputType('LLMSpeechGenerationInput', {
  fields: (t) => ({
    provider: t.field({ type: LlmProviderEnum, required: true }),
    model: t.string({
      required: true,
      description:
        'TTS model ID, e.g. google/gemini-3.1-flash-tts-preview. Local models use their own IDs.',
    }),
    text: t.string({
      required: true,
      description: 'Exact text to synthesize; no automatic translation.',
    }),
    prompt: t.string({
      description:
        'Voice/style instructions. OpenRouter: Gemini 3.1 Flash TTS uses text instructions; OpenAI uses provider options. Local: instructions field.',
    }),
    language: t.string({
      description:
        'Default language hint, e.g. ru or en-US. OpenRouter Gemini 3.1 Flash TTS / OpenAI: included in instructions. Local: language field, if supported.',
    }),
    voice: t.string({
      description:
        'Model-specific voice ID; omit only if the provider supports a default.',
    }),
    responseFormat: t.field({
      type: LLMSpeechFormat,
      description:
        'Gemini TTS: wav (default, PCM wrapped locally for playback) or raw pcm. Other OpenRouter models: mp3 (default) or pcm. Local formats depend on the API.',
    }),
    speed: t.float({
      description: '0.25–4; supported range depends on the model.',
    }),
    providerOptions: t.field({
      type: 'Json',
      description:
        'Forwarded as provider, including options keyed by provider slug. Explicit prompt/language override OpenAI instructions.',
    }),
  }),
})

const LLMSpeechResponseType = builder.simpleObject('LLMSpeechResponse', {
  fields: (t) => ({
    id: t.string({ nullable: true }),
    audioUrl: t.string({
      nullable: false,
      description: 'Inline base64 audio data URL; no file is persisted.',
    }),
    mimeType: t.string({ nullable: false }),
    format: t.string({ nullable: false }),
  }),
})

export const llmSpeechGenerationArgs = (
  t: Parameters<Parameters<typeof builder.mutationField>[1]>[0],
) => ({ input: t.arg({ type: LLMSpeechGenerationInput, required: true }) })

type Args = InferArgs<ReturnType<typeof llmSpeechGenerationArgs>>

export const llmSpeechGenerationResolver = async (
  _root: unknown,
  { input }: Args,
  ctx: PrismaContext,
) => {
  if (!input) {
    throw new Error('TTS input is required')
  }
  return ctx.llmClient.speechGeneration(input.provider, input.model, {
    text: input.text,
    prompt: input.prompt ?? undefined,
    language: input.language ?? undefined,
    voice: input.voice ?? undefined,
    responseFormat: input.responseFormat ?? undefined,
    speed: input.speed ?? undefined,
    providerOptions: input.providerOptions ?? undefined,
  })
}

builder.mutationField('llmSpeechGeneration', (t) =>
  t.field({
    type: LLMSpeechResponseType,
    nullable: false,
    args: llmSpeechGenerationArgs(t),
    resolve: llmSpeechGenerationResolver,
  }),
)

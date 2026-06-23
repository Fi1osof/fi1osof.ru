import { builder } from '../../../builder'
import type { LLMResponse } from '../../../../llm/client/interfaces'
import {
  LlmProvider,
  LlmModel,
  LLMChatMessageRole,
} from '../../../../llm/client/interfaces'
import { PrismaContext } from 'server/context/interfaces'
import { InferArgs } from '../../helpers/types'
import { LlmProviderEnum, LlmModelEnum, LLMResponseType } from '../types'

// https://openrouter.ai/docs/guides/overview/multimodal/image-generation#aspect-ratio

const LLMImageGenerationAspectRatioInput = builder.enumType(
  'LLMImageGenerationAspectRatioInput',
  {
    values: {
      AspectRatio_1_1: {
        value: '1:1',
        description: '1024×1024',
      },
      AspectRatio_2_3: {
        value: '2:3',
        description: '832×1248',
      },
      AspectRatio_3_2: {
        value: '3:2',
        description: '1248×832',
      },
      AspectRatio_3_4: {
        value: '3:4',
        description: '864×1184',
      },
      AspectRatio_4_3: {
        value: '4:3',
        description: '1184×864',
      },
      AspectRatio_4_5: {
        value: '4:5',
        description: '896×1152',
      },
      AspectRatio_5_4: {
        value: '5:4',
        description: '1152×896',
      },
      AspectRatio_9_16: {
        value: '9:16',
        description: '768×1344',
      },
      AspectRatio_16_9: {
        value: '16:9',
        description: '1344×768',
      },
      AspectRatio_21_9: {
        value: '21:9',
        description: '1536×672',
      },
      AspectRatio_1_4: {
        value: '1:4',
        description:
          'Tall, narrow format ideal for scrolling carousels and vertical UI elements',
      },
      AspectRatio_4_1: {
        value: '4:1',
        description:
          'Wide, short format for hero banners and horizontal layouts',
      },
      AspectRatio_1_8: {
        value: '1:8',
        description:
          'Extra-tall format for notification headers and narrow vertical spaces',
      },
      AspectRatio_8_1: {
        value: '8:1',
        description:
          'Extra-wide format for wide-format banners and panoramic layouts',
      },
    },
  },
)

const LLMImageGenerationImageSizeInput = builder.enumType(
  'LLMImageGenerationImageSizeInput',
  {
    values: {
      ImageSize_0_5K: {
        value: '0.5K',
        description:
          'Lower resolution, optimized for efficiency (supported by google/gemini-3.1-flash-image-preview only)',
      },
      ImageSize_1K: {
        value: '1K',
        description: 'Standard resolution (default)',
      },
      ImageSize_2K: {
        value: '2K',
        description: 'Higher resolution',
      },
      ImageSize_4K: {
        value: '4K',
        description: 'Highest resolution',
      },
    },
  },
)

const LLMImageGenerationInputType = builder.inputType(
  'LLMImageGenerationInput',
  {
    fields: (t) => ({
      provider: t.field({ type: LlmProviderEnum, required: true }),
      model: t.field({ type: LlmModelEnum, required: true }),
      prompt: t.string({ required: true }),
      aspectRatio: t.field({
        type: LLMImageGenerationAspectRatioInput,
        defaultValue: '1:1',
      }),
      imageSize: t.field({
        type: LLMImageGenerationImageSizeInput,
        defaultValue: '1K',
      }),
    }),
  },
)

export const llmImageGenerationArgs = (
  t: Parameters<Parameters<typeof builder.mutationField>[1]>[0],
) => ({
  input: t.arg({ type: LLMImageGenerationInputType, required: true }),
})

type LLMImageGenerationArgs = InferArgs<
  ReturnType<typeof llmImageGenerationArgs>
>

export const llmImageGenerationResolver = async (
  _root: unknown,
  args: LLMImageGenerationArgs,
  ctx: PrismaContext,
): Promise<LLMResponse> => {
  const { llmClient } = ctx
  const input = args.input
  const provider = input?.provider as LlmProvider
  const model = input?.model as LlmModel
  const prompt = input?.prompt ?? ''
  const aspectRatio = input?.aspectRatio
  const imageSize = input?.imageSize

  return llmClient.imageGeneration(provider, model, {
    messages: [
      {
        role: LLMChatMessageRole.user,
        content: prompt,
      },
    ],
    // modalities: ['image', 'text'],
    // modalities: ['image'],
    image_config: {
      aspect_ratio: aspectRatio ?? undefined,
      image_size: imageSize ?? undefined,
    },
  })
}

builder.mutationField('llmImageGeneration', (t) =>
  t.field({
    type: LLMResponseType,
    nullable: false,
    args: llmImageGenerationArgs(t),
    resolve: llmImageGenerationResolver,
  }),
)

import { builder } from '../../../builder'
import type {
  LLMClientChatMessage,
  LLMResponse,
} from '../../../../llm/client/interfaces'
import { LlmProvider, LlmModel } from '../../../../llm/client/interfaces'
import { PrismaContext } from 'server/context/interfaces'
import { InferArgs } from '../../helpers/types'
import {
  LLMChatMessageRoleEnum,
  LLMResponseType,
  LlmProviderEnum,
  LlmModelEnum,
} from '../types'

const LLMChatMessageContentPartInputType = builder.inputType(
  'LLMChatMessageContentPartInput',
  {
    fields: (t) => ({
      type: t.string({ required: true }),
      text: t.string(),
      imageUrl: t.string(),
    }),
  },
)

const LLMToolCallFunctionInputType = builder.inputType(
  'LLMToolCallFunctionInput',
  {
    fields: (t) => ({
      name: t.string({ required: true }),
      arguments: t.string({ required: true }),
    }),
  },
)

const LLMToolCallInputType = builder.inputType('LLMToolCallInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    type: t.string({ required: true }),
    function: t.field({ type: LLMToolCallFunctionInputType, required: true }),
  }),
})

const LLMToolInputType = builder.inputType('LLMToolInput', {
  fields: (t) => ({
    type: t.string({ required: true }),
    parameters: t.field({ type: 'Json' }),
  }),
})

const LLMChatMessageInputType = builder.inputType('LLMChatMessageInput', {
  fields: (t) => ({
    role: t.field({ type: LLMChatMessageRoleEnum, required: true }),
    content: t.string(),
    contentParts: t.field({ type: [LLMChatMessageContentPartInputType] }),
    toolCalls: t.field({ type: [LLMToolCallInputType] }),
    toolCallId: t.string(),
  }),
})

const LLMChatCompletionInputType = builder.inputType('LLMChatCompletionInput', {
  fields: (t) => ({
    provider: t.field({ type: LlmProviderEnum, required: true }),
    model: t.field({ type: LlmModelEnum, required: true }),
    messages: t.field({ type: [LLMChatMessageInputType], required: true }),
    tools: t.field({ type: [LLMToolInputType] }),
    maxTokens: t.int(),
    temperature: t.float(),
    topP: t.float(),
    stop: t.stringList(),
    providerOptions: t.field({ type: 'Json' }),
  }),
})

export const llmChatCompletionArgs = (
  t: Parameters<Parameters<typeof builder.mutationField>[1]>[0],
) => ({
  input: t.arg({ type: LLMChatCompletionInputType, required: true }),
})

type LLMChatCompletionArgs = InferArgs<ReturnType<typeof llmChatCompletionArgs>>

export const llmChatCompletionResolver = async (
  _root: unknown,
  args: LLMChatCompletionArgs,
  ctx: PrismaContext,
): Promise<LLMResponse> => {
  const { llmClient } = ctx
  const input = args.input
  const provider = input?.provider as LlmProvider
  const model = input?.model as LlmModel
  const messages = input?.messages ?? []
  const tools = input?.tools
  const maxTokens = input?.maxTokens
  const temperature = input?.temperature
  const topP = input?.topP
  const stop = input?.stop
  const providerOptions = input?.providerOptions

  const clientMessages: LLMClientChatMessage[] = messages.map((msg) => {
    const base: LLMClientChatMessage = {
      role: msg.role,
    }

    if (msg.contentParts && msg.contentParts.length > 0) {
      base.content = msg.contentParts.map((part) => {
        if (part.type === 'image_url' && part.imageUrl) {
          return {
            type: 'image_url' as const,
            image_url: { url: part.imageUrl },
          }
        }
        return {
          type: 'text' as const,
          text: part.text ?? '',
        }
      })
    } else if (msg.content) {
      base.content = msg.content
    }

    if (msg.toolCalls && msg.toolCalls.length > 0) {
      base.tool_calls = msg.toolCalls.map((tc) => ({
        id: tc.id,
        type: 'function' as const,
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      }))
    }

    if (msg.toolCallId) {
      base.tool_call_id = msg.toolCallId
    }

    return base
  })

  const clientTools = tools?.map((tool) => ({
    type: tool.type,
    parameters: tool.parameters,
  }))

  return llmClient.chatCompletion(provider, model, {
    messages: clientMessages,
    tools: clientTools,
    max_tokens: maxTokens ?? undefined,
    temperature: temperature ?? undefined,
    top_p: topP ?? undefined,
    stop: stop ?? undefined,
    providerOptions: providerOptions ?? undefined,
  })
}

builder.mutationField('llmChatCompletion', (t) =>
  t.field({
    type: LLMResponseType,
    nullable: false,
    args: llmChatCompletionArgs(t),
    resolve: llmChatCompletionResolver,
  }),
)

import { builder } from 'server/schema/builder'
import type { LLMResponse } from '../../../../llm/client/interfaces'
import { LlmProvider, LlmModel } from '../../../../llm/client/interfaces'
import { PrismaContext } from 'server/context/interfaces'
import { InferArgs } from '../../helpers/types'
import { LLMResponseType, LlmProviderEnum, LlmModelEnum } from '../types'

const LLMCompletionInputType = builder.inputType('LLMCompletionInput', {
  fields: (t) => ({
    provider: t.field({ type: LlmProviderEnum, required: true }),
    model: t.field({ type: LlmModelEnum, required: true }),
    prompt: t.string({ required: true }),
    maxTokens: t.int(),
    temperature: t.float(),
    topP: t.float(),
    stop: t.stringList(),
  }),
})

export const llmCompletionArgs = (
  t: Parameters<Parameters<typeof builder.mutationField>[1]>[0],
) => ({
  input: t.arg({ type: LLMCompletionInputType, required: true }),
})

type LLMCompletionArgs = InferArgs<ReturnType<typeof llmCompletionArgs>>

export const llmCompletionResolver = async (
  _root: unknown,
  args: LLMCompletionArgs,
  ctx: PrismaContext,
): Promise<LLMResponse> => {
  const { llmClient } = ctx
  const input = args.input
  const provider = input?.provider as LlmProvider
  const model = input?.model as LlmModel
  const prompt = input?.prompt ?? ''
  const maxTokens = input?.maxTokens
  const temperature = input?.temperature
  const topP = input?.topP
  const stop = input?.stop

  return llmClient.completion(provider, model, {
    prompt,
    max_tokens: maxTokens ?? undefined,
    temperature: temperature ?? undefined,
    top_p: topP ?? undefined,
    stop: stop ?? undefined,
  })
}

builder.mutationField('llmCompletion', (t) =>
  t.field({
    type: LLMResponseType,
    nullable: false,
    args: llmCompletionArgs(t),
    resolve: llmCompletionResolver,
  }),
)

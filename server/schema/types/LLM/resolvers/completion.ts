import { builder } from '../../../builder'
import type { LLMCompletionOutput } from '../interfaces'
import { PrismaContext } from 'server/context/interfaces'
import { InferArgs } from '../../helpers/types'
import { LLMCompletionOutputType } from '../types'

const LLMCompletionInputType = builder.inputType('LLMCompletionInput', {
  fields: (t) => ({
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
): Promise<LLMCompletionOutput> => {
  const { llmClient } = ctx
  const input = args.input
  const prompt = input?.prompt ?? ''
  const maxTokens = input?.maxTokens
  const temperature = input?.temperature
  const topP = input?.topP
  const stop = input?.stop

  const response = await llmClient.completion({
    prompt,
    max_tokens: maxTokens ?? undefined,
    temperature: temperature ?? undefined,
    top_p: topP ?? undefined,
    stop: stop ?? undefined,
  })

  const choice = response.choices[0]

  return {
    text: choice?.text ?? '',
    finishReason: choice?.finish_reason ?? 'unknown',
    usage: response.usage
      ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : undefined,
  }
}

builder.mutationField('llmCompletion', (t) =>
  t.field({
    type: LLMCompletionOutputType,
    nullable: false,
    args: llmCompletionArgs(t),
    resolve: llmCompletionResolver,
  }),
)

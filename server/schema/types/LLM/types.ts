import { LLMChatMessageRole } from 'server/llm/client/interfaces'
import { builder } from 'server/schema/builder'

const LLMUsageType = builder.simpleObject('LLMUsage', {
  fields: (t) => ({
    promptTokens: t.int({ nullable: false }),
    completionTokens: t.int({ nullable: false }),
    totalTokens: t.int({ nullable: false }),
  }),
})

export const LLMCompletionOutputType = builder.simpleObject(
  'LLMCompletionOutput',
  {
    fields: (t) => ({
      text: t.string({ nullable: false }),
      finishReason: t.string({ nullable: false }),
      usage: t.field({ type: LLMUsageType, nullable: true }),
    }),
  },
)

export const LLMChatMessageRoleEnum = builder.enumType('LLMChatMessageRole', {
  values: Object.values(LLMChatMessageRole),
})

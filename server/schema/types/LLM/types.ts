import {
  LLMChatMessageRole,
  LlmProvider,
  LlmModel,
} from 'server/llm/client/interfaces'
import { builder } from 'server/schema/builder'

export const LlmProviderEnum = builder.enumType('LlmProvider', {
  values: Object.values(LlmProvider),
})

const LlmModelEnumValues: Partial<{
  [K in keyof typeof LlmModel]: {
    value: (typeof LlmModel)[K]
    description?: string
  }
}> = Object.fromEntries(
  Object.entries(LlmModel).map(([key, value]) => [key, { value }]),
)

export const LlmModelEnum = builder.enumType('LlmModel', {
  values: LlmModelEnumValues,
})

const LLMUsagePromptTokensDetailsType = builder.simpleObject(
  'LLMUsagePromptTokensDetails',
  {
    fields: (t) => ({
      cachedTokens: t.int({ nullable: true }),
      cacheWriteTokens: t.int({ nullable: true }),
      audioTokens: t.int({ nullable: true }),
      videoTokens: t.int({ nullable: true }),
    }),
  },
)

const LLMUsageCostDetailsType = builder.simpleObject('LLMUsageCostDetails', {
  fields: (t) => ({
    upstreamInferenceCost: t.float({ nullable: true }),
    upstreamInferencePromptCost: t.float({ nullable: true }),
    upstreamInferenceCompletionsCost: t.float({ nullable: true }),
  }),
})

const LLMUsageCompletionTokensDetailsType = builder.simpleObject(
  'LLMUsageCompletionTokensDetails',
  {
    fields: (t) => ({
      reasoningTokens: t.int({ nullable: true }),
      imageTokens: t.int({ nullable: true }),
      audioTokens: t.int({ nullable: true }),
    }),
  },
)

const LLMUsageType = builder.simpleObject('LLMUsage', {
  fields: (t) => ({
    promptTokens: t.int({ nullable: false }),
    completionTokens: t.int({ nullable: false }),
    totalTokens: t.int({ nullable: false }),
    cost: t.float({ nullable: true }),
    isByok: t.boolean({ nullable: true }),
    promptTokensDetails: t.field({
      type: LLMUsagePromptTokensDetailsType,
      nullable: true,
    }),
    costDetails: t.field({ type: LLMUsageCostDetailsType, nullable: true }),
    completionTokensDetails: t.field({
      type: LLMUsageCompletionTokensDetailsType,
      nullable: true,
    }),
  }),
})

const LLMToolCallFunctionType = builder.simpleObject('LLMToolCallFunction', {
  fields: (t) => ({
    name: t.string({ nullable: false }),
    arguments: t.string({ nullable: false }),
  }),
})

const LLMToolCallType = builder.simpleObject('LLMToolCall', {
  fields: (t) => ({
    id: t.string({ nullable: false }),
    type: t.string({ nullable: false }),
    function: t.field({ type: LLMToolCallFunctionType, nullable: false }),
  }),
})

const LLMImageType = builder.simpleObject('LLMImage', {
  fields: (t) => ({
    imageUrl: t.string({ nullable: false }),
  }),
})

const LLMChoiceMessageType = builder.simpleObject('LLMChoiceMessage', {
  fields: (t) => ({
    role: t.string({ nullable: false }),
    content: t.string({ nullable: true }),
    toolCalls: t.field({ type: [LLMToolCallType], nullable: true }),
    toolCallId: t.string({ nullable: true }),
    images: t.field({ type: [LLMImageType], nullable: true }),
  }),
})

const LLMChoiceType = builder.simpleObject('LLMChoice', {
  fields: (t) => ({
    index: t.int({ nullable: false }),
    message: t.field({ type: LLMChoiceMessageType, nullable: false }),
    finishReason: t.string({ nullable: false }),
  }),
})

export const LLMResponseType = builder.simpleObject('LLMResponse', {
  fields: (t) => ({
    id: t.string({ nullable: false }),
    object: t.string({ nullable: false }),
    created: t.int({ nullable: false }),
    choices: t.field({ type: [LLMChoiceType], nullable: false }),
    usage: t.field({ type: LLMUsageType, nullable: true }),
  }),
})

export const LLMChatMessageRoleEnum = builder.enumType('LLMChatMessageRole', {
  values: Object.values(LLMChatMessageRole),
})

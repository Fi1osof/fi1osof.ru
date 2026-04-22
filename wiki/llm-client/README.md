# LLM Client

Direct access to LLM capabilities via GraphQL and TypeScript — no n8n workflows required.

## Overview

The LLM Client provides two ways to interact with the local LLM server:

1. **GraphQL mutations** — for experimentation and testing in GraphQL Playground
2. **Server-side `llmClient`** — for use in resolvers, middleware, and background jobs

## Configuration

Add to `docker/.env`:

```env
# LLM API endpoint (default: http://llama:8080/v1)
LLM_API_URL=http://llama:8080/v1
```

## GraphQL API

### Mutations

Both mutations require `isSudo` permission.

#### `llmCompletion`

Raw text completion:

```graphql
mutation {
  llmCompletion(
    input: {
      prompt: "The capital of France is"
      maxTokens: 50
      temperature: 0.7
    }
  ) {
    text
    finishReason
    usage {
      promptTokens
      completionTokens
      totalTokens
    }
  }
}
```

#### `llmChatCompletion`

Multi-turn chat completion with full OpenAI-compatible message format:

```graphql
mutation {
  llmChatCompletion(
    input: {
      messages: [
        { role: system, content: "You are a helpful assistant." }
        { role: user, content: "Hello!" }
      ]
      temperature: 0.7
      maxTokens: 500
    }
  ) {
    text
    finishReason
    usage {
      promptTokens
      completionTokens
      totalTokens
    }
  }
}
```

### Message Roles

- `system` — system prompt
- `user` — user message
- `assistant` — assistant response
- `tool` — tool execution result

### Vision Support

Send images as base64 data URLs:

```graphql
mutation {
  llmChatCompletion(
    input: {
      messages: [
        {
          role: user
          content: [
            { type: "image_url", imageUrl: { url: "data:image/png;base64,..." } }
            { type: "text", text: "What is in this image?" }
          ]
        }
      ]
    }
  ) {
    text
  }
}
```

**Note:** Requires vision model (e.g., Qwen3.5 with mmproj). See [Computer Vision](../computer-vision/README.md).

### Tool Calling History

Include tool calls and responses in conversation history:

```graphql
mutation {
  llmChatCompletion(
    input: {
      messages: [
        { role: system, content: "You are a calculator." }
        { role: user, content: "What is 25 * 4?" }
        {
          role: assistant
          content: null
          toolCalls: [
            {
              id: "call_123"
              type: "function"
              function: {
                name: "calculate"
                arguments: "{\"expression\": \"25 * 4\"}"
              }
            }
          ]
        }
        {
          role: tool
          toolCallId: "call_123"
          content: "100"
        }
      ]
    }
  ) {
    text
  }
}
```

## Server-Side Usage

The `llmClient` is available in the GraphQL context:

```typescript
import { LLMChatMessageRole } from 'server/llm/client/interfaces'

async function myResolver(parent, args, ctx) {
  const { llmClient } = ctx

  const response = await llmClient.chatCompletion({
    messages: [
      { role: LLMChatMessageRole.system, content: 'You are a helpful assistant.' },
      { role: LLMChatMessageRole.user, content: 'Hello!' },
    ],
    max_tokens: 500,
    temperature: 0.7,
  })

  return response.choices[0].message.content
}
```

### Example: Auto-generate File Metadata

```typescript
async function processFile({ file, ctx }: ProcessFileProps) {
  const { prisma, llmClient } = ctx

  const imageBuffer = await readFile(join('uploads', file.path))
  const base64 = imageBuffer.toString('base64')
  const dataUrl = `data:${file.mimetype};base64,${base64}`

  const response = await llmClient.chatCompletion({
    messages: [
      {
        role: LLMChatMessageRole.user,
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          { type: 'text', text: 'Return JSON: { "name": "...", "description": "..." }' },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  })

  const result = JSON.parse(response.choices[0].message.content)
  
  await prisma.file.update({
    where: { id: file.id },
    data: { name: result.name, description: result.description },
  })
}
```

### Example: Auto-tag Content

```typescript
async function autoTagConcept({ concept, ctx }: AutoTagProps) {
  const { prisma, llmClient } = ctx

  const response = await llmClient.chatCompletion({
    messages: [
      { role: LLMChatMessageRole.system, content: 'Extract 3-5 tags. Return JSON: ["tag1", "tag2"]' },
      { role: LLMChatMessageRole.user, content: concept.content },
    ],
    temperature: 0.2,
  })

  const tags = JSON.parse(response.choices[0].message.content)
  
  await prisma.kBConcept.update({
    where: { id: concept.id },
    data: { data: { tags } },
  })
}
```

## Files

```
server/
├── llm/
│   └── client/
│       ├── index.ts          # LLMClient class
│       └── interfaces.ts     # Types and enums
└── schema/types/
    └── LLM/
        ├── index.ts          # GraphQL type definition
        ├── interfaces.ts     # Resolver interfaces
        ├── types.ts          # LlamaUsage type
        └── resolvers/
            ├── chatCompletion.ts
            └── completion.ts
```

## See Also

- [Local LLM Server](../llama-server/README.md) — llama.cpp setup
- [Computer Vision](../computer-vision/README.md) — image recognition

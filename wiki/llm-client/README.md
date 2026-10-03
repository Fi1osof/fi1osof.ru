# LLM Client

Direct access to text, vision, image generation, and speech synthesis through GraphQL or the server-side `llmClient`. No n8n workflow is required.

## Methods

See [Methods and capabilities](./methods.md) for resolver inputs, outputs, examples, and model-specific limitations.

| GraphQL mutation | TypeScript method | Purpose |
| --- | --- | --- |
| `llmCompletion` | `completion` | Continue a text prompt using a local API |
| `llmChatCompletion` | `chatCompletion` | Text conversations, image understanding, and tool-call history |
| `llmImageGeneration` | `imageGeneration` | Generate images from a prompt |
| `llmSpeechGeneration` | `speechGeneration` | Convert text to speech with voice and delivery controls |

All four mutations require an authenticated user with status `active` (`isActive`). The `/admin/tts` page additionally requires `sudo`; this is a UI restriction, not the mutation's permission rule.

## Configuration

Configure the provider in the server environment (for Docker, `docker/.env`):

```env
# Local OpenAI-compatible API; required when using provider Local
LLM_LOCAL_API_URL=http://llama:8080/v1
# Optional local API authentication
LLM_LOCAL_API_KEY=

# Required when using provider OpenRouter
OPENROUTER_API_KEY=your-api-key
# Optional; this is the default
OPENROUTER_API_URL=https://openrouter.ai/api/v1

# Optional: permit image models listed in LLM_TOP_MODELS
LLM_ALLOW_TOP_MODELS=false
```

The selected API and model must support the requested operation. Configuring a local text model does not enable image generation or TTS automatically.

## Server-side usage

The client is available as `ctx.llmClient` in resolvers, or as an exported singleton for server-side jobs. Every method takes `(provider, model, request)`:

```typescript
import { llmClient } from 'server/llm/client'
import {
  LLMChatMessageRole,
  LlmModel,
  LlmProvider,
} from 'server/llm/client/interfaces'

const response = await llmClient.chatCompletion(
  LlmProvider.OpenRouter,
  LlmModel.Gemini2_5_Flash,
  {
    messages: [
      { role: LLMChatMessageRole.user, content: 'Summarize this topic.' },
    ],
    max_tokens: 500,
    temperature: 0.3,
  },
)

const text = response.choices[0]?.message.content
```

GraphQL uses camelCase input names such as `maxTokens`; the text client methods use API-style names such as `max_tokens`. TTS uses camelCase in both interfaces. Check the request types before calling the client directly.

## Implementation

- [Client and provider configuration](../../server/llm/client/index.ts)
- [Request/response types and model enum](../../server/llm/client/interfaces.ts)
- [GraphQL response types](../../server/schema/types/LLM/types.ts)
- [Resolver registration](../../server/schema/types/LLM/index.ts)
- [GraphQL operations](../../src/gql/src/LLM.graphql)

## See also

- [Methods and capabilities](./methods.md)
- [Local LLM Server](../llama-server/README.md) — local inference setup
- [Computer Vision](../computer-vision/README.md) — local image recognition
- [Image Generation](../image-generation/README.md) — generation and saving in FileUploader

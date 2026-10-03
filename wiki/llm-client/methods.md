# LLM methods and capabilities

[LLM Client](./README.md) covers configuration and access. This page describes the four GraphQL mutations and their corresponding client methods.

Every mutation accepts an `input` object with required `provider` (`Local` or `OpenRouter`) and `model`. Text and image methods use the GraphQL `LlmModel` enum; speech accepts a model ID string. The enum lists configured IDs, not a guarantee that every model supports every operation.

## Text completion — `llmCompletion`

Continue a single text `prompt`, without conversation roles or history. Useful for a local API's raw completion mode.

- **Required:** `provider`, `model`, `prompt`.
- **Controls:** `maxTokens`, `temperature`, `topP`, `stop`.
- **Result:** `LLMResponse`; generated text is in `choices[].message.content`, with `finishReason` and optional `usage`.
- **Limitation:** OpenRouter is rejected for this method. Use chat completion instead. The local API must implement `/completions`.

[Resolver](../../server/schema/types/LLM/resolvers/completion.ts) · Client: `llmClient.completion(provider, model, request)`.

## Chat and vision — `llmChatCompletion`

Generate text from a conversation: questions and answers, summaries, translation, extraction, or analysis of images when the model supports vision.

- **Required:** `provider`, `model`, `messages`.
- **Messages:** roles `system`, `user`, `assistant`, and `tool`; use `content` for text or `contentParts` for text/image parts. Non-empty `contentParts` takes precedence over `content`.
- **Controls:** `maxTokens`, `temperature`, `topP`, `stop`, `tools`, and `providerOptions` (forwarded as the API's `provider` object).
- **Tool calling:** accepts `toolCalls` and `toolCallId` in history and returns tool calls from the model. The resolver does not execute tools or run a tool loop.
- **Result:** `choices[].message` contains text and optional tool calls; `usage` contains token counts and cost details when supplied by the provider.

```graphql
mutation {
  llmChatCompletion(input: {
    provider: OpenRouter
    model: Gemini2_5_Flash
    messages: [
      { role: system, content: "Answer briefly." }
      { role: user, content: "Explain photosynthesis." }
    ]
    maxTokens: 300
  }) {
    choices { message { content } finishReason }
    usage { totalTokens cost }
  }
}
```

For vision, replace a user message's `content` with `contentParts`:

```graphql
# Inside messages: imageUrl is a string, not an { url } object.
{
  role: user
  contentParts: [
    { type: "text", text: "Describe this image." }
    { type: "image_url", imageUrl: "data:image/png;base64,..." }
  ]
}
```

Image URL support depends on the provider; local vision setup is described in [Computer Vision](../computer-vision/README.md).

[Resolver](../../server/schema/types/LLM/resolvers/chatCompletion.ts) · Client: `llmClient.chatCompletion(provider, model, request)`.

## Image generation — `llmImageGeneration`

Generate images from a text description using an image-capable model.

- **Required:** `provider`, `model`, `prompt`.
- **Controls:** `aspectRatio` (default `AspectRatio_1_1`) and `imageSize` (default `ImageSize_1K`). Sizes include `0.5K`, `1K`, `2K`, and `4K`; support depends on the model. The resolver enum contains the available aspect ratios.
- **Result:** image URLs/data URLs in `choices[].message.images[].imageUrl`, optional accompanying text, and provider usage information.
- **Limits:** this resolver accepts a text prompt, not source images for editing. Models in `LLM_TOP_MODELS` require `LLM_ALLOW_TOP_MODELS=true`.
- **Storage:** the resolver does not save files. The [FileUploader workflow](../image-generation/README.md) handles preview and saving separately.

```graphql
mutation {
  llmImageGeneration(input: {
    provider: OpenRouter
    model: Gemini3_1_Flash_Image
    prompt: "A watercolor illustration of a forest classroom"
    aspectRatio: AspectRatio_16_9
    imageSize: ImageSize_1K
  }) {
    choices { message { content images { imageUrl } } }
    usage { totalTokens cost }
  }
}
```

[Resolver](../../server/schema/types/LLM/resolvers/imageGeneration.ts) · Client: `llmClient.imageGeneration(provider, model, request)`.

## Speech synthesis — `llmSpeechGeneration` (TTS)

Read supplied text aloud. The `text` is the material to speak; `prompt` gives delivery instructions. Selecting a language does not translate the text.

- **Required:** `provider`, `model` (string ID), `text`.
- **Controls:** `voice`, `language`, `prompt`, `responseFormat`, `speed`, and `providerOptions`.
- **Result:** `audioUrl` (inline base64 data URL), `mimeType`, `format`, and optional generation `id`. No file is persisted and no token/cost usage is returned by this resolver.

### Model-specific behavior

| Model/API | Prompt and language | Audio format and speed |
| --- | --- | --- |
| OpenRouter `google/gemini-3.1-flash-tts-preview` | Added as natural-language instructions before the text | Requests PCM upstream. Returns WAV by default (24 kHz, 16-bit mono), or raw `pcm` on request. MP3 is rejected. `speed` is omitted; describe pacing in `prompt`. |
| OpenRouter OpenAI models, when available | Mapped to `provider.options.openai.instructions` | Defaults to `mp3`; `pcm` is also accepted by the client. Actual support depends on the model. |
| Other OpenRouter models | Generic `prompt`/`language` are rejected; use documented provider-specific settings through `providerOptions` | Client accepts `mp3`/`pcm`; individual models may impose stricter limits. |
| Local compatible API | Forwarded as `instructions` and `language` | Defaults to `mp3`; also accepts `pcm`, `wav`, `opus`, `aac`, `flac` if the API supports them. |

When supplied, `speed` must be between `0.25` and `4`; provider limits may be narrower. `providerOptions` is forwarded as `provider`. Explicit `prompt`/`language` override OpenAI instructions in that object.

```graphql
mutation {
  llmSpeechGeneration(input: {
    provider: OpenRouter
    model: "google/gemini-3.1-flash-tts-preview"
    text: "Hello! Today we are learning new words."
    prompt: "Speak warmly and slowly."
    language: "en"
    voice: "Kore"
    responseFormat: wav
  }) {
    id
    audioUrl
    mimeType
    format
  }
}
```

The `/admin/tts` form provides text and prompt fields, model selection by ID, and Gemini dropdowns for 78 language codes plus automatic detection and 30 voices. These lists are maintained in [the frontend enums](../../src/components/pages/Admin/TTS/View/options.ts). Other models retain manual language/voice input. Ctrl+Enter or Shift+Enter submits the form; generated audio can be played or downloaded.

Check model availability in the [OpenRouter speech catalog](https://openrouter.ai/api/v1/models?output_modalities=speech); a model ID shown in a documentation example may not be available. See [OpenRouter TTS](https://openrouter.ai/docs/guides/overview/multimodal/tts) and [Gemini TTS](https://ai.google.dev/gemini-api/docs/speech-generation) for provider capabilities.

[Resolver](../../server/schema/types/LLM/resolvers/speechGeneration.ts) · Client: `llmClient.speechGeneration(provider, model, request)`.

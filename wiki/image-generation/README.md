# AI Image Generation

Generate images directly in the FileUploader component using LLM-powered image generation.

## Overview

The FileUploader component now includes an integrated image generator that allows users to create images via text prompts without leaving the upload interface. The generated images can be previewed, reviewed, and either saved to the system or cancelled.

## Features

- **Integrated workflow** — generate, preview, and save images in one place
- **LLM-powered** — uses Gemini 3.1 Flash Image model via OpenRouter
- **Configurable** — set aspect ratio (16:9) and resolution (1K)
- **User-controlled** — generate, review, then save or cancel
- **Drag & drop support** — works alongside traditional file upload

## Configuration

Enable image generation by setting the environment variable:

```env
NEXT_PUBLIC_ALLOW_GENERATE_IMAGES=true
```

Add this to your `docker/.env` file.

## Requirements

- OpenRouter API key configured in credentials
- User status must be `ACTIVE` to access the feature
- Environment variable `NEXT_PUBLIC_ALLOW_GENERATE_IMAGES` set to `true`

## Usage

1. Open any FileUploader component in the application
2. Enter a text description of the desired image in the textarea
3. Click "Generate image" button
4. Review the generated image preview
5. Click "Save" to upload the image to the system, or "Cancel" to discard

## Technical Details

### Component Location

- **Generator component:** `src/components/FileUploader/Generator/index.tsx`
- **Main uploader:** `src/components/FileUploader/index.tsx`

### GraphQL Mutation

Uses the `llmImageGeneration` mutation with the following parameters:

- **Provider:** OpenRouter
- **Model:** Gemini 3.1 Flash Image (`GEMINI3_1_FLASH_IMAGE`)
- **Aspect Ratio:** 16:9
- **Image Size:** 1K resolution

### User Access Control

The generator checks two conditions before rendering:

```typescript
ALLOW_GENERATE_IMAGES && currentUser?.status === UserStatusEnum.ACTIVE
```

Where `ALLOW_GENERATE_IMAGES` is derived from `NEXT_PUBLIC_ALLOW_GENERATE_IMAGES` environment variable.

## Image Processing

Generated images are returned as URLs from the LLM provider. The system:

1. Fetches the image from the URL
2. Converts to blob
3. Creates a File object
4. Uploads via the standard `singleUpload` mutation
5. Returns the uploaded file to the parent component

## Future Enhancements

Potential improvements:

- Custom aspect ratio selection
- Multiple resolution options
- Style presets
- Image editing capabilities
- Batch generation

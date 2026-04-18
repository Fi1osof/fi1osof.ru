# Computer Vision (Image Recognition)

Local image recognition using Qwen3.5 vision model via llama.cpp. Analyze images, charts, diagrams — all running on your GPU without cloud APIs.

## Requirements

- NVIDIA GPU with CUDA support (same as [llama-server](../llama-server/README.md))
- Qwen3.5-4B model (or larger) with mmproj file

## Configuration

Add to `docker/.env`:

```env
# Main model (4B recommended for vision)
LLAMA_MODEL=unsloth/Qwen3.5-4B-GGUF/Qwen3.5-4B-Q8_0.gguf

# Vision encoder (required for image input)
LLAMA_MMPROJ=unsloth/Qwen3.5-4B-GGUF/mmproj-F16.gguf

# Context size (increase for large images + long prompts)
LLAMA_CTX_SIZE=4096
```

Both files are auto-downloaded from HuggingFace on first run.

## Usage

### Start the server

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up llama -d
```

Check logs for successful mmproj loading:

```bash
docker compose logs llama --tail 20
```

### Send image request

Images must be sent as base64 (llama.cpp doesn't fetch URLs):

```bash
# Convert image to base64
IMG_BASE64=$(curl -s "https://example.com/image.png" | base64 -w0)

# Send request
curl -s http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"llama\",
    \"messages\": [{
      \"role\": \"user\",
      \"content\": [
        {\"type\": \"image_url\", \"image_url\": {\"url\": \"data:image/png;base64,\${IMG_BASE64}\"}},
        {\"type\": \"text\", \"text\": \"What is in this image?\"}
      ]
    }],
    \"max_tokens\": 1000
  }"
```

## Model Files

Downloaded to `docker/llama/models/`:

| File | Size | Description |
|------|------|-------------|
| `Qwen3.5-4B-Q8_0.gguf` | 4.2 GB | Main language model |
| `mmproj-F16.gguf` | 672 MB | Vision encoder (CLIP) |

## Troubleshooting

### "image input is not supported"

mmproj not loaded. Check:
1. `LLAMA_MMPROJ` is set in `.env`
2. File exists in `docker/llama/models/`
3. Restart llama service after changing `.env`

### "Failed to load image"

Invalid base64 or unsupported format. Verify:
```bash
echo $IMG_BASE64 | base64 -d | file -
# Should output: PNG image data, ...
```

### Transparent PNG shows as black

Vision models expect RGB images. PNG with transparency converts to black background by default.

**Solution:** Add white background before sending:

```bash
# Using ImageMagick
convert input.png -background white -flatten output.png

# Or via image server with ?bg=ffffff parameter
```

### Response truncated

Increase context size:
```env
LLAMA_CTX_SIZE=8192
```

Or increase max_tokens in request.

## Performance

On NVIDIA RTX 3060/4060:
- Image encoding: ~100-300ms
- Generation: ~40 tokens/sec
- VRAM usage: ~6 GB (Q8_0 + mmproj)

## Available mmproj Files

| File | Size | Quality |
|------|------|---------|
| `mmproj-F32.gguf` | 1.3 GB | Maximum |
| `mmproj-BF16.gguf` | 675 MB | High |
| `mmproj-F16.gguf` | 672 MB | Recommended |

## See Also

- [llama-server](../llama-server/README.md) — base LLM server setup
- [Jinja Templates](../jinja-templates/README.md) — chat template configuration

# Local LLM Server (llama.cpp)

The project includes a local LLM server based on [llama.cpp](https://github.com/ggerganov/llama.cpp) with CUDA support for NVIDIA GPUs.

## Requirements

⚠️ **This service requires NVIDIA GPU with CUDA support.**

Before using the local llama.cpp server, verify your system meets these requirements:

1. **NVIDIA GPU** with CUDA support
2. **CUDA drivers** installed on host system:
   ```bash
   nvidia-smi
   ```
   Should display your GPU info and driver version.

3. **NVIDIA Container Toolkit** for Docker:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install -y nvidia-container-toolkit
   sudo systemctl restart docker
   ```

## Configuration

### Environment Variables

Add to `docker/.env`:

```env
# Model from HuggingFace (format: owner/repo/filename)
LLAMA_MODEL=unsloth/Qwen3.5-0.8B-GGUF/Qwen3.5-0.8B-Q8_0.gguf

# Optional: HuggingFace token for gated models
HUGGINGFACE_TOKEN=hf_xxx...

# Optional: GPU layers (default: 99 = all layers on GPU)
LLAMA_GPU_LAYERS=99

# Optional: Context size (default: 4096)
LLAMA_CTX_SIZE=4096

# Optional: Server port (default: 8080)
LLAMA_PORT=8080
```

### Available Models

Public models (no token required):
- `unsloth/Qwen3.5-0.8B-GGUF/Qwen3.5-0.8B-Q8_0.gguf` — 0.8B, ~1GB VRAM
- `Qwen/Qwen3-0.6B-GGUF/Qwen3-0.6B-Q8_0.gguf` — 0.6B, ~800MB VRAM

For larger models, check [HuggingFace](https://huggingface.co/models?search=GGUF) and ensure you have enough VRAM.

### AI Credentials

To use the local llama.cpp server as AI backend, configure `credentials/system/openrouter.json`:

```json
[
  {
    "id": "openrouter-cred",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "llama", "url": "http://llama:8080/v1" }
  }
]
```

## Usage

### Start the server

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up llama
```

On first run, the model will be automatically downloaded from HuggingFace.

### Verify it's running

```bash
curl http://localhost:8080/v1/models
```

### API

The server provides OpenAI-compatible API:
- `POST /v1/chat/completions` — chat completions
- `POST /v1/completions` — text completions
- `GET /v1/models` — list available models

## Troubleshooting

### "CUDA error" or GPU not detected

1. Verify CUDA drivers: `nvidia-smi`
2. Verify Docker can access GPU: `docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi`
3. Restart Docker: `sudo systemctl restart docker`

### Model download fails

1. Check if model exists on HuggingFace
2. For gated models, add `HUGGINGFACE_TOKEN` to `.env`
3. Delete partial download and retry:
   ```bash
   rm docker/llama/models/*.tmp
   ```

### Out of VRAM

1. Use a smaller model or lower quantization (Q4 instead of Q8)
2. Reduce `LLAMA_GPU_LAYERS` to offload some layers to CPU
3. Reduce `LLAMA_CTX_SIZE`

## Chat Templates

llama.cpp server uses Jinja templates to format chat messages. By default, the template is read from GGUF model metadata.

### Configuration

Add to `docker/.env`:

```env
# Enable Jinja template engine (default: 1)
LLAMA_JINJA=1

# Built-in template: chatml, llama2, llama3, qwen, gemma, phi3, deepseek, etc.
LLAMA_CHAT_TEMPLATE=qwen

# Or use custom template file (path inside container)
LLAMA_CHAT_TEMPLATE_FILE=/config/templates/my-template.jinja

# Template kwargs as JSON (e.g., disable thinking for Qwen3)
LLAMA_CHAT_TEMPLATE_KWARGS={"enable_thinking":false}
```

### Extract Template from Model

Use the script to extract the default template from a GGUF model:

```bash
python3 docker/llama/scripts/extract-chat-template.py \
    docker/llama/models/Qwen3.5-0.8B-Q8_0.gguf \
    > docker/llama/config/templates/qwen/default.jinja
```

### Inspect Current Template

```bash
# Check which template is active
curl http://localhost:8080/props | jq .chat_template

# View process arguments
docker exec -it llama cat /proc/1/cmdline | tr '\0' ' '
```

## Files

- `docker/llama/entrypoint.sh` — startup script with auto-download
- `docker/llama/models/` — downloaded models (gitignored)
- `docker/llama/config/templates/` — custom Jinja templates
- `docker/llama/scripts/extract-chat-template.py` — extract template from GGUF

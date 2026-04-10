#!/bin/bash
set -e

# LLAMA_MODEL format: owner/repo/filename (e.g. Qwen/Qwen3-0.6B-GGUF/Qwen3-0.6B-Q8_0.gguf)
MODEL_REPO=$(echo "$LLAMA_MODEL" | cut -d'/' -f1-2)
MODEL_FILE=$(echo "$LLAMA_MODEL" | cut -d'/' -f3-)
MODEL_PATH="/models/${MODEL_FILE}"

if [ ! -f "$MODEL_PATH" ]; then
    echo "Model not found, downloading from HuggingFace: $MODEL_REPO/$MODEL_FILE"
    
    CURL_OPTS="-L --progress-bar -f"
    if [ -n "$HUGGINGFACE_TOKEN" ]; then
        CURL_OPTS="$CURL_OPTS -H \"Authorization: Bearer $HUGGINGFACE_TOKEN\""
    fi
    
    TEMP_PATH="${MODEL_PATH}.tmp"
    if eval curl $CURL_OPTS -o "$TEMP_PATH" \
        "https://huggingface.co/${MODEL_REPO}/resolve/main/${MODEL_FILE}"; then
        mv "$TEMP_PATH" "$MODEL_PATH"
        echo "Model downloaded successfully"
    else
        rm -f "$TEMP_PATH"
        echo "ERROR: Failed to download model"
        exit 1
    fi
fi

exec /app/llama-server \
    --model "$MODEL_PATH" \
    --host 0.0.0.0 \
    --port ${LLAMA_PORT:-8080} \
    --n-gpu-layers ${LLAMA_GPU_LAYERS:-99} \
    --ctx-size ${LLAMA_CTX_SIZE:-4096}

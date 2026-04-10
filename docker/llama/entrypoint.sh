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

VERBOSE_FLAG=""
if [ "${LLAMA_VERBOSE:-0}" = "1" ]; then
    VERBOSE_FLAG="--verbose"
    echo "Starting llama-server in VERBOSE mode"
    echo "Model: $MODEL_PATH"
    echo "GPU layers: ${LLAMA_GPU_LAYERS:-99}"
    echo "Context size: ${LLAMA_CTX_SIZE:-4096}"
fi

# Jinja template engine (enabled by default)
JINJA_FLAG=""
if [ "${LLAMA_JINJA:-1}" = "1" ]; then
    JINJA_FLAG="--jinja"
fi

# Chat template: built-in name OR custom file path
TEMPLATE_FLAG=""
if [ -n "$LLAMA_CHAT_TEMPLATE" ]; then
    TEMPLATE_FLAG="--chat-template $LLAMA_CHAT_TEMPLATE"
elif [ -n "$LLAMA_CHAT_TEMPLATE_FILE" ] && [ -f "$LLAMA_CHAT_TEMPLATE_FILE" ]; then
    TEMPLATE_FLAG="--chat-template-file $LLAMA_CHAT_TEMPLATE_FILE"
fi

# Template kwargs (JSON string) - only add if non-empty and valid
# Using LLAMA_TEMPLATE_KWARGS to avoid llama-server reading LLAMA_CHAT_TEMPLATE_KWARGS directly
TEMPLATE_KWARGS_FLAG=""
if [ -n "$LLAMA_TEMPLATE_KWARGS" ] && [ "$LLAMA_TEMPLATE_KWARGS" != "{}" ]; then
    TEMPLATE_KWARGS_FLAG="--chat-template-kwargs $LLAMA_TEMPLATE_KWARGS"
fi

exec /app/llama-server \
    --model "$MODEL_PATH" \
    --host 0.0.0.0 \
    --port ${LLAMA_PORT:-8080} \
    --n-gpu-layers ${LLAMA_GPU_LAYERS:-99} \
    --ctx-size ${LLAMA_CTX_SIZE:-4096} \
    $VERBOSE_FLAG \
    $JINJA_FLAG \
    $TEMPLATE_FLAG \
    $TEMPLATE_KWARGS_FLAG

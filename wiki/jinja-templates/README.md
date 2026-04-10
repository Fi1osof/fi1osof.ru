# Jinja Templates

A guide to Jinja2 templates for LLM chat templates.

## Contents

- [Glossary](./glossary.md) — key terms and definitions
- [Basics](./basics.md) — syntax, variables, filters
- [Built-in Filters](./builtin-filters.md) — filter reference

## What is a Chat Template?

A chat template is a Jinja2 template that transforms structured chat messages into a text format understood by a specific LLM.

**Input data:**
```json
{
  "messages": [
    {"role": "system", "content": "You are helpful assistant"},
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"}
  ]
}
```

**Output text (ChatML format):**
```
<|im_start|>system
You are helpful assistant<|im_end|>
<|im_start|>user
Hello<|im_end|>
<|im_start|>assistant
Hi there!<|im_end|>
```

## Why is this needed?

Different models are trained on different formats:
- **ChatML** — `<|im_start|>role\ncontent<|im_end|>`
- **Llama** — `[INST] content [/INST]`
- **Mistral** — `<s>[INST] content [/INST]`

Chat templates abstract these differences.

## Our Template

Main project template: `docker/llama/config/templates/qwen/default.jinja`

Features:
- **Multimodal** — image and video support
- **Tool calling** — function call format
- **Thinking** — `<think>` blocks for chain-of-thought

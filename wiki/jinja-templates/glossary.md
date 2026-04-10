# Glossary

Key terms for Jinja2 chat templates.

## Jinja2 Syntax

| Term | Description |
|------|-------------|
| `{{ }}` | Expression output — renders variable or expression result |
| `{% %}` | Statement — control flow (if, for, set, macro) |
| `{# #}` | Comment — ignored in output |
| `{{- }}` / `{{ -}}` | Whitespace control — strips whitespace before/after |
| `{%- %}` / `{% -%}` | Whitespace control for statements |

## Variables & Filters

| Term | Description |
|------|-------------|
| **filter** | Transforms value: `value \| filter` |
| **tojson** | Filter that converts to JSON string |
| **trim** | Filter that removes leading/trailing whitespace |
| **safe** | Filter that marks string as safe (no escaping) |
| **namespace** | Mutable container for variables in loops |

## Control Flow

| Term | Description |
|------|-------------|
| **macro** | Reusable template function |
| **loop** | Special variable inside `for` loops |
| **loop.index0** | Zero-based iteration index |
| **loop.first** / **loop.last** | Boolean flags for first/last iteration |
| **loop.previtem** / **loop.nextitem** | Adjacent items in iteration |

## Chat Template Specific

| Term | Description |
|------|-------------|
| **messages** | Input array of chat messages |
| **role** | Message sender: `system`, `user`, `assistant`, `tool` |
| **content** | Message text or multimodal content array |
| **tools** | Array of available function definitions |
| **tool_calls** | Function calls made by assistant |
| **add_generation_prompt** | Flag to append assistant prompt prefix |

## Special Tokens

| Token | Description |
|-------|-------------|
| `<\|im_start\|>` | Message start delimiter (ChatML) |
| `<\|im_end\|>` | Message end delimiter (ChatML) |
| `<\|vision_start\|>` | Multimodal content start |
| `<\|vision_end\|>` | Multimodal content end |
| `<\|image_pad\|>` | Image placeholder |
| `<\|video_pad\|>` | Video placeholder |

## Tool Calling

| Term | Description |
|------|-------------|
| `<tool_call>` | Wrapper for function call |
| `<function=name>` | Function name declaration |
| `<parameter=name>` | Parameter with value |
| `<tool_response>` | Wrapper for tool execution result |

## Thinking / Reasoning

| Term | Description |
|------|-------------|
| `<think>` | Start of reasoning block (chain-of-thought) |
| `</think>` | End of reasoning block |
| **reasoning_content** | Extracted thinking from message |
| **enable_thinking** | Flag to enable/disable thinking mode |

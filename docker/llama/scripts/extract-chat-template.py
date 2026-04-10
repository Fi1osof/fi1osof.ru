#!/usr/bin/env python3
"""
Extract chat_template from GGUF model file.
Usage: python3 extract-chat-template.py <model_path>
"""

import sys

def extract_chat_template(model_path: str) -> str:
    with open(model_path, 'rb') as f:
        data = f.read()
    
    marker = b'tokenizer.chat_template'
    idx = data.find(marker)
    
    if idx < 0:
        raise ValueError("chat_template not found in model metadata")
    
    search_start = idx + len(marker)
    
    for i in range(search_start, min(search_start + 200, len(data))):
        if data[i:i+2] == b'{%':
            end = i
            while end < len(data) and data[end] != 0:
                end += 1
            template = data[i:end].decode('utf-8', errors='ignore').strip()
            if 'tokenizer.' in template:
                template = template[:template.find('tokenizer.')]
            return template.strip()
    
    raise ValueError("Jinja template start not found after chat_template marker")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <model_path>", file=sys.stderr)
        sys.exit(1)
    
    model_path = sys.argv[1]
    
    try:
        template = extract_chat_template(model_path)
        print(template)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

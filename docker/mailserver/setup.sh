#!/bin/bash
#
# Wrapper script for docker-mailserver setup
# Usage: ./setup.sh <command> [args]
#
# Commands:
#   email add <email> [password]   - Add email account
#   email del <email>              - Delete email account
#   email list                     - List email accounts
#   alias add <from> <to>          - Add email alias
#   alias del <from> <to>          - Delete email alias
#   alias list                     - List aliases
#   config dkim                    - Generate DKIM keys
#   debug                          - Show container logs
#
# Examples:
#   ./setup.sh email add user@example.com
#   ./setup.sh config dkim

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

CONTAINER_NAME="mailserver"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Error: Container '${CONTAINER_NAME}' is not running."
    echo "Start it with: docker compose up -d mailserver"
    exit 1
fi

docker exec -it "${CONTAINER_NAME}" setup "$@"

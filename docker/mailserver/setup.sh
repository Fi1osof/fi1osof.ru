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

SERVICE_NAME="mailserver"

if ! docker compose -f "$PROJECT_ROOT/docker-compose.yml" ps --status running --format '{{.Service}}' 2>/dev/null | grep -q "^${SERVICE_NAME}$"; then
    echo "Error: Service '${SERVICE_NAME}' is not running."
    echo "Start it with: docker compose up -d mailserver"
    exit 1
fi

docker compose -f "$PROJECT_ROOT/docker-compose.yml" exec "${SERVICE_NAME}" setup "$@"

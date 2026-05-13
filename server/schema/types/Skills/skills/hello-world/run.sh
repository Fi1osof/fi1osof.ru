#!/usr/bin/env sh
# Demo script for the hello-world skill.
# Accepts generic --key value arguments and echoes them.

set -e

MESSAGE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --message)
      MESSAGE="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

echo "hello-world skill says: ${MESSAGE:-<no message>}"

#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${UPSTASH_EMAIL:-}" || -z "${UPSTASH_API_KEY:-}" ]]; then
  echo "[context7] Please export UPSTASH_EMAIL and UPSTASH_API_KEY" >&2
  exit 1
fi

PORT=${CONTEXT7_PORT:-3000}

exec npx @upstash/mcp-server@latest \
  --transport http \
  --port "${PORT}" \
  --email "${UPSTASH_EMAIL}" \
  --api-key "${UPSTASH_API_KEY}"

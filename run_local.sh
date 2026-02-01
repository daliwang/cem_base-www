#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-8000}"

echo "Serving ${ROOT} at http://localhost:${PORT}"
echo "Press Ctrl+C to stop."

python3 -m http.server --cgi --bind 127.0.0.1 --directory "${ROOT}" "${PORT}"

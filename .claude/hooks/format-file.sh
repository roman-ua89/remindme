#!/usr/bin/env bash
# Receives the hook event as JSON on stdin. Exit 2 = send stderr back to Claude to fix.
ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
command -v jq >/dev/null || { echo "format-file.sh: jq is not installed, so no file was formatted or linted" >&2; exit 2; }
FILE=$(jq -r '.tool_input.file_path // empty')
case "$FILE" in
    */frontend/src/*.ts|*/frontend/src/*.tsx)
        cd "$ROOT/frontend" || exit 0
        npx prettier --write "$FILE" >/dev/null
        if ! OUT=$(npx eslint "$FILE" 2>&1); then
            echo "$OUT" >&2
            exit 2
        fi
        ;;
esac
exit 0

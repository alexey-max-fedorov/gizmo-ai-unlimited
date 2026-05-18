#!/usr/bin/env bash
set -euo pipefail

NEW_VERSION="${1:-}"
if [ -z "$NEW_VERSION" ]; then
  echo "Usage: ./bump-version.sh <new-version>"
  echo "Example: ./bump-version.sh 2.2.0"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Update root package.json
node -e "
  const fs = require('fs');
  const p = '$ROOT/package.json';
  const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
"

# Update patcher/src/constants.ts
sed -i '' "s/^export const VERSION = \".*\";/export const VERSION = \"$NEW_VERSION\";/" \
  "$ROOT/patcher/src/constants.ts"

echo "✓ Bumped to v$NEW_VERSION"
echo "  → package.json"
echo "  → patcher/src/constants.ts"

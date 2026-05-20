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

# Update patcher/package.json
node -e "
  const fs = require('fs');
  const p = '$ROOT/patcher/package.json';
  const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
"

# Update patcher/src/constants.ts
sed -i '' "s/^export const VERSION = \".*\";/export const VERSION = \"$NEW_VERSION\";/" \
  "$ROOT/patcher/src/constants.ts"

# Update src/popup.tsx eyebrow version (e.g. >v2.2.0<)
sed -i '' -E "s|(popup-eyebrow\">)v[0-9]+\.[0-9]+\.[0-9]+(</p>)|\1v$NEW_VERSION\2|" \
  "$ROOT/src/popup.tsx"

# Update PRIVACY_POLICY.md header line (e.g. # Privacy Policy — Gizmo AI Unlimited v2.2.0)
sed -i '' -E "s|(Gizmo AI Unlimited v)[0-9]+\.[0-9]+\.[0-9]+|\1$NEW_VERSION|g" \
  "$ROOT/PRIVACY_POLICY.md"

# Update PRIVACY_POLICY.md "current version (vX.Y.Z)" reference
sed -i '' -E "s|(current version \(v)[0-9]+\.[0-9]+\.[0-9]+(\))|\1$NEW_VERSION\2|g" \
  "$ROOT/PRIVACY_POLICY.md"

echo "✓ Bumped to v$NEW_VERSION"
echo "  → package.json"
echo "  → patcher/package.json"
echo "  → patcher/src/constants.ts"
echo "  → src/popup.tsx"
echo "  → PRIVACY_POLICY.md"

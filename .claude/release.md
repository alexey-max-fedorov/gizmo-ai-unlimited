# Release & packaging

## Chrome / Edge / Brave
1. `pnpm build` → `build/chrome-mv3-prod/`
2. Load unpacked from `build/chrome-mv3-prod/` for local testing.

## Firefox (AMO)
1. `pnpm build:firefox` → `build/firefox-mv3-prod/`
2. Temporary install: `about:debugging` → "Load Temporary Add-on" → pick `manifest.json`
3. AMO validator is strict — see `.claude/gotchas.md` for `data_collection_permissions`

## Packaging both targets
`pnpm package` runs `package.sh`, which builds Chrome + Firefox, packages both, and copies the zips to `dist/`:
- `dist/gizmo-ai-unlimited-v{VERSION}-chrome.zip`
- `dist/gizmo-ai-unlimited-v{VERSION}-firefox.zip`

## Versioning
Run `./bump-version.sh <version>` — syncs version across `package.json`, `patcher/package.json`, `patcher/src/constants.ts`, `src/popup.tsx` (the `<p className="popup-eyebrow">` line), and `PRIVACY_POLICY.md` (header + "current version" line). `PRIVACY_POLICY.md` is the policy linked from the AMO listing.

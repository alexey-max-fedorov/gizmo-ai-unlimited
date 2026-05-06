# Release & packaging

## Chrome / Edge / Brave
1. `pnpm build` → `build/chrome-mv3-prod/`
2. `pnpm package` → `build/chrome-mv3-prod.zip` for Chrome Web Store
3. Or: load unpacked from `build/chrome-mv3-prod/`

## Firefox (AMO)
1. `pnpm build:firefox` → `build/firefox-mv3-prod/`
2. `pnpm package:firefox` → zip for AMO submission
3. Temporary install: `about:debugging` → "Load Temporary Add-on" → pick `manifest.json`
4. AMO validator is strict — see `.claude/gotchas.md` for `data_collection_permissions`

## Versioning
Bump `version` in `package.json` (Plasmo writes it into the generated manifest) **and** update the version string in `popup.tsx` (the `<p className="popup-eyebrow">` line) to match. `PRIVACY_POLICY.md` is the policy linked from the AMO listing.

# CLAUDE.md

Two-part system on `app.gizmo.ai/*`. **Patcher** (`./patcher/`, a Node CLI run by a scheduled GitHub Action) fetches the live Gizmo bundle, runs structured `applyRules` over it, and publishes `./patcher/dist/patches.json` (primary artifact) plus `./patcher/dist/entry.min.js` (verification copy). **Extension** (Plasmo MV3) blocks the original bundle via declarativeNetRequest, fetches `patches.json` + the original bundle in the background, applies patches locally, caches the result in `chrome.storage.local`, and injects via the `onreset` trick.

**Stack:** Plasmo · React 19 · TypeScript 6 · pnpm · Node `--test` · `--experimental-strip-types`
**Targets:** Chrome MV3, Firefox MV3 (AMO)

## Where to look

- **`.claude/build.md`** — dev/build/test commands, patcher commands, Node 22+ requirement
- **`.claude/architecture.md`** — file layout, content-script flow, DNR rule, patcher pipeline
- **`.claude/gotchas.md`** — Parcel + `engines.node`, AMO `data_collection_permissions`, bot detection on Gizmo HTML, `onreset` URL shadowing
- **`.claude/release.md`** — Chrome vs Firefox packaging, manifest differences, AMO submission

## House rules

- The patcher applies three patch types: `replace` (regex find/replace on a known minified pattern — keep regexes tightly anchored), `append` (inject JS at the end of the bundle), and `prepend` (inject JS at the start). Any `replace` rule must use a tightly anchored regex. `append`/`prepend` rules must not break the bundle's existing initialization order.
- The extension fetches `patches.json` from `raw.githubusercontent.com/alexey-max-fedorov/gizmo-ai-unlimited/main/...` — if you fork, update `PATCHES_URL` in `src/lib/patch-config.ts`.
- Run `pnpm typecheck && pnpm test` (extension) and `cd patcher && pnpm typecheck && pnpm test` (patcher) before declaring work done.

## Version Bump
`./bump-version.sh <version>` — syncs version across `package.json`, `patcher/package.json`, `patcher/src/constants.ts`, `src/popup.tsx`, and `PRIVACY_POLICY.md`

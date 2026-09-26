Two-part system on `app.gizmo.ai/*`. **Patcher** (`./patcher/`, a Node CLI run by a scheduled GitHub Action) fetches the live Gizmo bundle, runs structured `applyRules` over it, and publishes `./patcher/dist/patches.json` (primary artifact) plus `./patcher/dist/entry.min.js` (verification copy). **Extension** (Plasmo MV3) does not fetch or execute remote JavaScript. A MAIN-world content script at `document_start` wraps Metro's `__d` and, after each module factory runs, forces `SnapshotState` subscription reads, `isSubscribedStore` reads, and `EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN`. Gizmo's own page loads its bundle.

**Stack:** Plasmo · React 19 · TypeScript 6 · pnpm · Node `--test` · `--experimental-strip-types`
**Targets:** Chrome MV3, Firefox MV3 (AMO)

## Where to look

- **`package.sh`** — `pnpm package` runs this script. It builds the Chrome and Firefox production zips into `dist/`. Packaging details are in `.claude/release.md`.
- **`.claude/build.md`** — dev/build/test commands, patcher commands, Node 22+ requirement
- **`.claude/webstores.md`** — which store listing runs which version
- **`.claude/architecture.md`** — file layout, content-script flow, DNR rule, patcher pipeline
- **`.claude/gotchas.md`** — Parcel + `engines.node`, AMO `data_collection_permissions`, bot detection on Gizmo HTML, `onreset` URL shadowing
- **`.claude/release.md`** — Chrome vs Firefox packaging, manifest differences, AMO submission

## House rules

- The patcher must NEVER do anything other than text-replace on a known minified pattern. Keep regexes tightly anchored.
- Do not fetch, eval, or `onreset`-inject Gizmo's bundle. Chrome Web Store rejects that as remotely hosted code (Blue Argon). Behavior changes live in `src/lib/runtime-patch.ts`.
- Run `pnpm typecheck && pnpm test` (extension) and `cd patcher && pnpm typecheck && pnpm test` (patcher) before declaring work done.

## Version Bump
`./bump-version.sh <version>` — syncs version across `package.json`, `patcher/package.json`, `patcher/src/constants.ts`, `website/src/lib/constants.ts`, `src/popup.tsx`, and `PRIVACY_POLICY.md`

# Architecture

Two subsystems share this repo.

## Patcher (`./patcher/`)
| Path | Role |
|------|------|
| `src/constants.ts` | Version, probe URL, origin, User-Agent, fetch timeout |
| `src/fetch-entry.ts` | `extractEntryUrl(html)` (pure), `fetchHtml(url)`, `fetchEntryBundle(path)` |
| `src/patches.ts` | `PatchRule` type, `RULES` array, `applyRules(source, rules)`, `hashRules(rules)` |
| `src/patch.ts` | Orchestrator + CLI entry: `runPatch(outputDir)` |
| `tests/*.test.ts` | Unit tests for the pure modules |
| `dist/patches.json` | **Primary artifact** — patch rules + content hash, consumed by the extension |
| `dist/entry.min.js` | Verification copy of the patched bundle (not loaded by extension at runtime) |
| `dist/metadata.json` | Per-run metadata: per-rule match counts, patches hash, byte sizes |

Pipeline: `runPatch()` fetches the live quiz HTML with a realistic User-Agent, regex-extracts `entry-*.js`, downloads it, runs `applyRules(source, RULES)`, throws if any rule's count is below `minMatches`, and writes the three artifacts above. The GitHub Action at `.github/workflows/patch.yml` runs this every 2 hours.

## Extension (top of repo)
| Path | Role |
|------|------|
| `background.ts` | DNR rule (BLOCK `entry-*.js`) + `chrome.runtime.onMessage` handler for `GET_PATCHED_BUNDLE` — fetches `patches.json`, checks cache, fetches+patches original on miss |
| `contents/gizmo-bridge.ts` | ISOLATED-world content script. Forwards CustomEvents between MAIN-world and background. |
| `contents/gizmo-patch.ts` | MAIN-world content script. Overrides DOM APIs to hijack the entry-script load; requests patched bundle from the bridge; injects via `onreset`. |
| `lib/patch-config.ts` | `PATCHES_URL`, `GIZMO_ENTRY_RE`, `isEntryScriptSrc()`, `entryFilenameFromUrl()` |
| `lib/patches.ts` | `PatchRule`, `applyPatchRules()`, `wrapWithMarkers()` (browser side) |
| `lib/bundle-cache.ts` | `getCachedBundle()`, `setCachedBundle()`, `clearCachedBundle()` over `chrome.storage.local` |
| `lib/reload-tabs.ts` | Reloads open `*.gizmo.ai` tabs after install |
| `popup.tsx` | Popup UI. React 19. Display-only. |
| `tests/*.test.ts` | Unit tests for the pure modules |

### Injection flow (cache miss)
1. Extension loads on `https://app.gizmo.ai/*`.
2. `background.ts` registers the DNR BLOCK rule for `entry-*.js` and listens for `GET_PATCHED_BUNDLE` messages.
3. The page's HTML contains `<script src="/_expo/static/js/web/entry-<hash>.js" defer>`. The DNR rule blocks the request.
4. The MAIN-world content script catches the script-tag insertion (via prototype overrides + MutationObserver), captures the original URL, neutralizes the script, and dispatches `__gizmo_patch_request__` on `document` with `{ originalUrl }`.
5. The ISOLATED-world bridge picks up the event, calls `chrome.runtime.sendMessage({ type: "GET_PATCHED_BUNDLE", originalUrl })`.
6. Background fetches `patches.json`, fetches the original bundle from gizmo.ai, applies `applyPatchRules`, wraps with markers, stores in `chrome.storage.local` keyed by `{bundleFilename, patchesHash}`, returns the patched JS.
7. The bridge dispatches `__gizmo_patch_response__` with the result. MAIN-world script injects via `document.documentElement.setAttribute("onreset", js); dispatchEvent("reset")`.
8. The patched Metro bundle runs; `isSubscribed` returns `true` → no hearts modal.

### Injection flow (cache hit)
Same as above except step 6 short-circuits at `getCachedBundle()` and returns the stored bundle directly. The patches.json fetch still happens (plain GET, browser HTTP cache); only the original bundle fetch and `applyPatchRules` work are skipped.

### Cache invalidation
Cache key is `{bundleFilename, patchesHash}`. A mismatch on either field triggers a full rebuild. `patchesHash` is `sha256(JSON.stringify(rules)).slice(0, 16)`, precomputed by the patcher and read verbatim from `patches.json`.

## Why MAIN world + ISOLATED bridge
The `onreset` trick and the prototype overrides must run in the page's JS realm (MAIN world). MAIN-world content scripts have no access to `chrome.*` APIs, so we use a second ISOLATED-world script as a postMessage-style bridge. DOM `CustomEvent` on `document` works across realms because the DOM is shared.

## Why DNR + prototype overrides
DNR blocks the network request; the prototype overrides prevent the original `<script>` element from being added to the DOM in any way. Either alone would mostly work — together they make the original bundle's execution functionally impossible. An extension's own service-worker fetches are NOT subject to its own DNR rules, so the background can still pull the original bundle from gizmo.ai for patching.

## Manifest
Lives in `package.json` under the `manifest` key (Plasmo convention), not a standalone `manifest.json`.
Permissions: `["declarativeNetRequest", "storage", "unlimitedStorage"]`.
Host permissions: `["https://*.gizmo.ai/*", "https://raw.githubusercontent.com/*"]`.

# Architecture

Two subsystems share this repo.

## Patcher (`./patcher/`)
| Path | Role |
|------|------|
| `src/constants.ts` | Version, probe URL, origin, User-Agent, fetch timeout |
| `src/fetch-entry.ts` | `extractEntryUrl(html)` (pure), `fetchHtml(url)`, `fetchEntryBundle(path)` |
| `src/patches.ts` | Pure transforms: `applyIsSubscribedPatch`, `addLoadMarkers`, `applyAllPatches` |
| `src/patch.ts` | Orchestrator + CLI entry: `runPatch(outputDir)` |
| `tests/*.test.ts` | Unit tests for the pure modules |
| `dist/entry.min.js` | Patched output. Committed by CI; read by the extension over HTTPS. |
| `dist/metadata.json` | Patch run metadata (timestamp, source URL, match counts) |

Pipeline: `runPatch()` fetches the live quiz HTML with a realistic User-Agent, regex-extracts `entry-*.js`, downloads it, runs `applyAllPatches`, and writes `dist/entry.min.js` + `dist/metadata.json`. The GitHub Action at `.github/workflows/patch.yml` runs this every 2 hours.

## Extension (top of repo)
| Path | Role |
|------|------|
| `background.ts` | Registers DNR rule that BLOCKs `*://app.gizmo.ai/_expo/static/js/web/entry-*.js` |
| `contents/gizmo-patch.ts` | MAIN-world content script. Overrides DOM APIs to hijack the entry-script load and synchronously inject the patched bundle via `onreset`. |
| `lib/patch-config.ts` | Pure module: `PATCHED_URL`, `GIZMO_ENTRY_RE`, `isEntryScriptSrc()`. Unit-tested. |
| `popup.tsx` | Popup UI. React 19. Display-only. |
| `tests/patch-config.test.ts` | Unit tests for the pure module |

### Injection flow
1. Extension loads on `https://app.gizmo.ai/*`.
2. `background.ts` (service worker) registers the DNR BLOCK rule for `entry-*.js`.
3. The page's HTML contains `<script src="/_expo/static/js/web/entry-*.js" defer>`. The DNR rule blocks the network request.
4. The MAIN-world `contents/gizmo-patch.ts` runs at `document_start` and:
   - Disables SRI on script/link elements.
   - Hooks `appendChild`/`insertBefore`/`append` so attempts to add the entry script become no-ops.
   - Runs a `MutationObserver` to catch parser-added script tags as the HTML streams in. When it sees the entry script, it neutralizes the src, fetches the patched bundle from `raw.githubusercontent.com`, and injects it synchronously via `document.documentElement.setAttribute("onreset", js); dispatchEvent("reset")`.
5. The Expo Metro bundle (now patched) starts as usual; `isSubscribed` returns `true` so the hearts modal never renders.

## Why MAIN world
The `onreset` trick mutates the DOM and runs arbitrary JS in the page's own JS context. ISOLATED world has its own JS realm and cannot affect the page's prototypes. We don't need chrome.storage for v2.0.0, so a single MAIN-world content script is enough.

## Manifest
Lives in `package.json` under the `manifest` key (Plasmo convention), not a standalone `manifest.json`.

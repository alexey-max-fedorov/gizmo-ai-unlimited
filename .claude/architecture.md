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

## Extension (`src/`)
| Path | Role |
|------|------|
| `src/contents/gizmo-runtime.ts` | MAIN-world content script at `document_start`. Installs the Metro `__d` hook. |
| `src/lib/runtime-patch.ts` | Pure hooks: snapshot subscription view, `isSubscribedStore` reads, import-cooldown env flag. |
| `src/popup.tsx` | Popup UI. React 19. Display-only. |
| `src/tests/*.test.ts` | Unit tests for the pure modules |

There is no background service worker, no declarativeNetRequest rule, and no `chrome.storage` cache. The page loads `entry-*.js` itself.

### Runtime flow
1. The content script runs at `document_start` in the page's JS realm, before Metro's runtime assigns global `__d`.
2. It defines `__d` with a getter that stays undefined until that assignment, then wraps every factory Metro registers.
3. After a factory returns, `patchModuleExports` looks for three stable names that survive minification:
   - `SnapshotState` — `snapshot.subscription.status` reads as `"subscribed"` (hearts, hints, cooldown). The stored snapshot is not rewritten, so a React subscriber does not loop.
   - `isSubscribedStore` — `.get()` and `.getSnapshot()` return `true` (paywall).
   - `runtimeConfig` — `EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN` is `"true"`, which makes the client cooldown expression false.
4. Gizmo's bundle executes as the page's own script. The extension never fetches it and never evals a string.

## Why MAIN world
The Metro define function lives on the page's `globalThis`. An isolated content script cannot see it. The hook has to be installed before `__expo-metro-runtime-*.js` runs, which is why it is `document_start`.

## Manifest
Lives in `package.json` under the `manifest` key (Plasmo convention), not a standalone `manifest.json`.
No host permissions and no API permissions are declared. Plasmo adds `scripting` itself for the MAIN-world content script. Content script match is `https://app.gizmo.ai/*`.

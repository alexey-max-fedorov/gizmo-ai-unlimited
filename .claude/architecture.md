# Architecture

Tiny extension. Four source files do all the work.

| Path | Role |
|------|------|
| `lib/filter-rules.ts` | Pure module — the cosmetic-filter selectors + a `buildCss()` helper. No DOM, no chrome APIs. Unit-tested. |
| `contents/gizmo-hide.ts` | Plasmo content script. Runs at `document_start` on `app.gizmo.ai/*`. Injects a `<style>` and listens for SPA navigations to add/remove it on quiz routes. |
| `popup.tsx` | Plasmo popup UI. React 19. |
| `tests/filter-rules.test.ts` | Node `--test` unit tests for the pure module. |

## Why a pure filter-rules module
Selectors are kept separate from the content script so they're testable without a DOM. The content script only handles "when to apply" — the rules themselves are data.

## SPA navigation
Gizmo is a SPA. The hide must apply on soft navigations into `/quiz`, not just initial load. The content script hooks `history.pushState` / `popstate` and toggles the injected style based on the current path.

## Manifest
Lives in `package.json` under the `manifest` key (Plasmo convention), not a standalone `manifest.json`.

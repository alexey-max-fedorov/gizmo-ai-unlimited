# Gizmo AI Unlimited Hearts

**Extension that bypasses the "out of hearts" modal on [Gizmo AI](https://app.gizmo.ai) quizzes.**

> Source-available — security through transparency. Every line of code that runs in your browser is in this repo. No remote code, no tracking, no analytics.

## What it does

Gizmo AI shows a modal that blocks practice sessions once you run out of hearts. This extension applies a uBlock Origin Lite-style cosmetic filter on `https://app.gizmo.ai/*` that hides that modal at `document_start` — before it ever paints. It also watches for SPA navigation events so the filter activates when you navigate into a quiz without a hard reload, and is removed when you leave.

That's it. No game-state mutation, no API spoofing, no network interception. Just CSS.

## Install

The extension is built with [Plasmo](https://plasmo.com), targeting MV3.

| Browser | Method |
|---------|--------|
| Chrome / Edge / Brave | `pnpm build` then load unpacked from `build/chrome-mv3-prod/` |
| Firefox | `pnpm build:firefox` then load temporary add-on from `build/firefox-mv3-prod/` |

## Ethics

This is a cosmetic accessibility/usability hack. It does not:
- Send your data anywhere
- Modify or spoof Gizmo's API responses
- Bypass payment or auth
- Load remote code

It only hides DOM elements that are already on the page. If Gizmo's pricing or product policy changes such that this no longer aligns with their terms, the responsible use is to support them directly — see their [pricing page](https://app.gizmo.ai/pricing).

The extension exists because we believe users should be able to control what their own browser renders. Same principle as ad blockers, reading-mode extensions, and dark-mode injectors.

## Development

> **Note:** Before running `pnpm build` or `pnpm dev` for the first time, approve native build dependencies:
> ```bash
> pnpm approve-builds
> ```
> This is needed because Plasmo depends on `@parcel/watcher`, `@swc/core`, and `esbuild`, which require native compilation.

```bash
# Install dependencies
pnpm install

# Dev mode (hot reload)
pnpm dev

# Production build
pnpm build

# Run unit tests
pnpm test

# TypeScript check
pnpm typecheck
```

> **Node.js 22.6+ required** for the test script (`node --experimental-strip-types`). Install via [nvm](https://github.com/nvm-sh/nvm) or [mise](https://mise.jdx.dev/) if needed.

> **Important:** Do not add `"engines": {"node": "..."}` to `package.json`. Parcel reads that field and switches to Node.js target resolution, breaking the browser extension build.

Load the unpacked extension from `build/chrome-mv3-dev/` (dev) or `build/chrome-mv3-prod/` (prod) in Chrome.

## Project structure

| Path | What it is |
|------|------------|
| `lib/filter-rules.ts` | Pure module: the 4 cosmetic-filter selectors + CSS builder |
| `contents/gizmo-hide.ts` | Plasmo content script — injects/removes CSS on navigation |
| `popup.tsx` | Extension popup |
| `tests/filter-rules.test.ts` | Node `--test` unit test for the pure module |

## License

[All Rights Reserved](LICENSE.txt) — Alexey Fedorov, 2026. Personal use permitted; commercial use requires written authorization.

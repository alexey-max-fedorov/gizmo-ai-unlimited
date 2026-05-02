# Gizmo AI Unlimited Hearts

**Free and open source extension that hides the "out of hearts" modal on [Gizmo AI](https://app.gizmo.ai) quizzes.**

> Open source — security through transparency. Every line of code that runs in your browser is in this repo. No remote code, no tracking, no analytics.

## What it does

Gizmo AI shows a modal that blocks practice sessions once you run out of hearts. This extension applies a uBlock Origin Lite-style cosmetic filter scoped to `https://app.gizmo.ai/quiz/*` that hides that modal at `document_start` — before it ever paints.

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

> **Note on `"type": "module"` in package.json:** This is required for `node --test --experimental-strip-types` to correctly resolve TypeScript test files as ESM. It is safe to keep alongside Plasmo's Parcel bundler, which uses its own module resolution independently of the root `package.json` `type` field.

Load the unpacked extension from `build/chrome-mv3-dev/` (dev) or `build/chrome-mv3-prod/` (prod) in Chrome.

## Project structure

| Path | What it is |
|------|------------|
| `contents/filter-rules.ts` | Pure module: the 4 cosmetic-filter selectors + CSS builder |
| `contents/gizmo-hide.ts` | Plasmo content script — injects the CSS at `document_start` |
| `popup.tsx` | Minimal informational popup |
| `tests/filter-rules.test.ts` | Node `--test` unit test for the pure module |

## License

[Mozilla Public License 2.0](LICENSE.txt)

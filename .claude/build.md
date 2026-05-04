# Build & test

## Commands
- `pnpm dev` — Plasmo dev (Chrome MV3, hot reload) → `build/chrome-mv3-dev/`
- `pnpm dev:firefox` — Firefox MV3 dev → `build/firefox-mv3-dev/`
- `pnpm build` / `pnpm build:firefox` — production builds
- `pnpm package` / `pnpm package:firefox` — produce zip for store submission
- `pnpm test` — Node native test runner over `tests/**/*.test.ts`
- `pnpm typecheck` — `tsc --noEmit`

## First-time setup
1. `pnpm install`
2. `pnpm approve-builds` — required so native deps (`@parcel/watcher`, `@swc/core`, `esbuild`, `lmdb`, `msgpackr-extract`, `sharp`) can compile
3. `pnpm build`

## Runtime
- **Node.js 22.6+ required** — tests use `node --experimental-strip-types` to run `.ts` directly
- Do **not** install ts-node or jest; the project deliberately uses node's built-in test runner

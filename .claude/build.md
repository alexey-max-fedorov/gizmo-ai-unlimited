# Build & test

## Extension (repo root)
- `pnpm dev` — Plasmo dev (Chrome MV3, hot reload) → `build/chrome-mv3-dev/`
- `pnpm dev:firefox` — Firefox MV3 dev → `build/firefox-mv3-dev/`
- `pnpm build` / `pnpm build:firefox` — production builds
- `pnpm package` — build both targets, package both, output to `dist/gizmo-ai-unlimited-v{VERSION}-{chrome,firefox}.zip`
- `pnpm test` — Node native test runner over `tests/**/*.test.ts`
- `pnpm typecheck` — `tsc --noEmit`

## Patcher (`./patcher/`)
- `cd patcher && pnpm run patch` — fetch current bundle, apply patches, write to `dist/`
- `cd patcher && pnpm test` — run patcher unit tests
- `cd patcher && pnpm run typecheck` — `tsc --noEmit`

## First-time setup
1. `pnpm install` (repo root) — installs extension deps
2. `cd patcher && pnpm install` (patcher has its own independent `pnpm-lock.yaml`)
3. `pnpm approve-builds` — required so native deps (`@parcel/watcher`, `@swc/core`, `esbuild`, `lmdb`, `msgpackr-extract`, `sharp`) can compile
4. `pnpm build`

## Runtime
- **Node.js 22.6+ required** — tests use `node --experimental-strip-types` to run `.ts` directly
- Do **not** install ts-node or jest; the project deliberately uses node's built-in test runner

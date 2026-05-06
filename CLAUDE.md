# CLAUDE.md

Plasmo MV3 browser extension that hides the "out of hearts" modal on `app.gizmo.ai/*` via cosmetic CSS filters. No remote code, no API spoofing, no tracking.

**Stack:** Plasmo · React 19 · TypeScript 6 · pnpm · Node `--test`
**Targets:** Chrome MV3, Firefox MV3 (AMO)

## Where to look

- **`.claude/build.md`** — dev/build/test commands, pnpm `approve-builds` step, Node 22.6+ requirement
- **`.claude/architecture.md`** — file layout, content-script SPA-navigation handling, filter-rules module, popup
- **`.claude/gotchas.md`** — Parcel breaks if `engines.node` is set; Firefox AMO `data_collection_permissions` schema; `--experimental-strip-types`
- **`.claude/release.md`** — Chrome vs Firefox packaging, manifest differences, AMO submission notes

## House rules

- Cosmetic-only: never add network interception, API spoofing, or game-state mutation
- Touch `package.json` `manifest` block carefully — AMO validation is strict
- Run `pnpm typecheck && pnpm test` before declaring work done

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

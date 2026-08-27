# Design Spec — Unlock Practice-Exam Hints (issue #34)

**Date:** 2026-08-27
**Status:** Proposed / deferred (recommend NOT bundling with the imports change)
**Scope:** Hints only. Practice exams have **no hearts** (verified — the practice-exam player HUD is timer + progress + a hints counter; zero `heart`/`life`/`loseLife` code in the practice chunk). So #34's "unlimited hearts in practice" is N/A; only hints are actionable.

## 1. Why this is not a one-rule change

Every rule the extension ships today rewrites `entry-*.js`. The practice-exam **hint gate does not live in `entry-*.js`.** It lives in `__common-<hash>.js`, a separate boot chunk that the extension never blocks or patches:

- `src/lib/patch-config.ts` → `GIZMO_ENTRY_RE` matches `entry-*.js` only.
- `src/background.ts` DNR rule blocks `entry-*.js` only.
- `src/contents/gizmo-patch.ts` intercepts via `isEntryScriptSrc` (entry only). A test in `src/tests/patch-config.test.ts` explicitly asserts `__common-*.js` does **not** match.

The hint count is also **server-authoritative**: it is an XState attempt-machine `context.availableHints` field, hydrated (not computed) from a `system.attempt.sync` WebSocket message off `practice-exam.gizmo.ai`. There is no client-side `isSubscribed → hints` computation to force. See `[[practice-exam-hints-gate]]` in memory for the raw findings.

## 2. The proposed patch rule

The stable anchor is the selector in `__common`:

```
getAvailableHints=function(t){return t.context.availableHints}
```

Rule (mirrors the existing tightly-anchored style):

```js
{
  id: "practice-exam-available-hints",
  description: "Force the practice-exam hint selector to Infinity (unlimited hints). Lives in __common-*.js, NOT entry-*.js — requires the multi-chunk architecture below.",
  find: "getAvailableHints=function\\(([\\w$]+)\\)\\{return \\1\\.context\\.availableHints\\}",
  flags: "g",
  replace: "getAvailableHints=function($1){return 1/0}",
  minMatches: 1
}
```

Patch the **selector**, not the HUD (`E>9999?'∞':E`) or the disable expression (`E<=0||!f`) — those reference unstable local minified vars (`E`, `f`); `getAvailableHints` is the stable method name. Forcing the selector to `1/0` makes the HUD render ∞ **and** keeps `E<=0` permanently false, so the hint button never disables. The hint *effect* (distractor elimination) is client-side, so it functionally works even though the server keeps its own count.

## 3. Architecture changes required (the hard part)

### Patcher
- Discover the `__common-<hash>.js` URL — it appears in the boot HTML `<script>` tags and in `entry`'s chunk manifest. Fetch it and apply a chunk-specific rule set.
- Evolve `patches.json` to carry **per-chunk** rules without breaking the current single-`rules[]` shape (e.g. add an optional `chunks: { entry: [...], common: [...] }` and keep `rules` as the entry default). `applyRules`/`applyPatchRules` stay identical per chunk.

### Extension
- Add a **2nd DNR BLOCK** rule for `__common-*.js`.
- Generalize `patch-config.ts` matching + `gizmo-patch.ts` interception to handle more than one chunk (today `injectPatchedBundle` is guarded by a single-shot `__GIZMO_PATCH_HANDLED__` flag).
- Add a **2nd cached bundle** in `bundle-cache.ts`, keyed per chunk + `patchesHash`.
- **THE CRITICAL RISK — ordered injection.** `__common` defines the modules `entry` depends on, so `__common` MUST execute before `entry`. The current injection is fire-and-forget; it must become a per-chunk, ordering-preserving sequence: inject `__common`, await its execution, then inject `entry`. **Get this wrong and the whole app bricks for every user — including the working quiz unlock.**

## 4. Risks & the soft-unlock caveat

- **Soft unlock.** The server still counts hint consumption (`attempt.hint.consumed` over WS). The client override shows ∞, keeps the button enabled, and distractor-elimination works — but it is not a "true" server unlock. Likely harmless for a study aid (no server-side scoring penalty observed), but not guaranteed.
- **Regression risk** to the shipped, working entry-only flow is the dominant cost. This re-architects the single most load-bearing part of the extension.

## 5. Testing strategy

- Unit tests: the new rule against representative `__common` snippets; multi-chunk `applyRules`.
- Observe a real practice exam (needs a deck where practice is unlocked — pick a **small** deck; practice unlocks after far fewer than the 245 the big AP deck requires, so don't grind that one).
- Live-test via the dev override (`PLASMO_PUBLIC_PATCHES_URL`, see `[[dev-testing-patches-override]]`), extended to also serve/patch the `__common` chunk. Verify the quiz unlock still works (no ordering regression) BEFORE checking practice hints.

## 6. Recommendation

**Technically possible, but a risky core re-architecture for a server-authoritative soft-unlock of one feature (hints) — hearts don't exist in practice.** Recommend doing it only as a deliberate, well-tested standalone effort, never bundled with an unrelated change. Ship #33 (imports) independently first (done — see PR #35).

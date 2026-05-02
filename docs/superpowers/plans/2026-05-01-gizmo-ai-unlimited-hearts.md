# Gizmo AI Unlimited Hearts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an open-source MV3 browser extension ("Gizmo AI Unlimited Hearts") that hides the "out of hearts" modal on `https://app.gizmo.ai/quiz/*` by injecting a uBlock Origin Lite-style cosmetic filter at `document_start`.

**Architecture:** A single Plasmo content script runs in the ISOLATED world at `document_start` on `https://app.gizmo.ai/quiz/*`, immediately injecting a `<style>` element into `documentElement` that hides the modal via 4 comma-combined CSS selectors (the same ones uBO Lite's element picker emitted for that overlay). No background script, no DNR rules, no remote code — pure cosmetic CSS injection scoped to the quiz route. The selector list lives in its own pure module so it can be unit-tested without a browser.

**Tech Stack:** Plasmo 0.90.5 (MV3), React 19 (popup only), TypeScript 6, pnpm, Node 20 built-in test runner (`node --test`) for the pure-module unit test, MPL-2.0 license.

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `package.json` | Plasmo project config, dependencies, MV3 manifest declaration, scripts |
| `tsconfig.json` | TypeScript config extending Plasmo base, strict mode, `chrome` types |
| `.gitignore` | Already present — extend with Plasmo build output dirs |
| `LICENSE.txt` | Mozilla Public License 2.0 (matches ProdigyOrigin) |
| `README.md` | Project overview, install links, ethics statement, dev instructions |
| `assets/icon.png` | Extension icon (512×512 PNG; placeholder generated via ImageMagick) |
| `contents/filter-rules.ts` | Pure module: exports `HEARTS_MODAL_SELECTORS` array + `buildHidingCSS()` function — no DOM access, easy to unit-test |
| `contents/gizmo-hide.ts` | Plasmo content script: at `document_start`, injects a `<style>` tag built from `filter-rules.ts` into `documentElement` |
| `popup.tsx` | Minimal popup: logo, title, status line ("Active on app.gizmo.ai/quiz/*"), GitHub link, MPL-2.0 footer |
| `style.css` | Popup styles (small, plain CSS — no Tailwind to keep dependency surface small) |
| `tests/filter-rules.test.ts` | Node `--test` unit test for `buildHidingCSS()` — no browser needed |

**Notes on decomposition:**
- The selector list is split out from the content script so it can be unit-tested under plain Node without jsdom. The content script is then trivial (3 DOM calls) and verified manually in-browser.
- No background service worker. The extension does no network interception, no DNR rules — purely cosmetic, so a background script would be dead weight.
- Popup is informational only (no settings). Keeping it minimal avoids React/lucide-react/framer-motion bloat that ProdigyOrigin pulled in for its developer-options UI.

---

## Task 1: Project scaffolding (package.json, tsconfig, gitignore)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Modify: `.gitignore`

- [ ] **Step 1: Inspect existing `.gitignore`**

Run: `cat .gitignore`
Expected: Some baseline ignores already present (Node-style). Note what's there so the next step doesn't duplicate entries.

- [ ] **Step 2: Append Plasmo-specific ignores to `.gitignore`**

Add these lines at the end of `.gitignore` (skip any that already exist):

```gitignore

# Plasmo
.plasmo/
build/
out/
keys.json

# Node
node_modules/

# OS
.DS_Store
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "gizmo-ai-unlimited-hearts",
  "version": "0.1.0",
  "private": true,
  "description": "Open-source MV3 extension that hides the out-of-hearts modal on app.gizmo.ai/quiz",
  "scripts": {
    "dev": "plasmo dev",
    "dev:firefox": "plasmo dev --target=firefox-mv3",
    "build": "plasmo build",
    "build:firefox": "plasmo build --target=firefox-mv3",
    "package": "plasmo package",
    "package:firefox": "plasmo package --target=firefox-mv3",
    "typecheck": "tsc --noEmit",
    "test": "node --test --experimental-strip-types tests/"
  },
  "dependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@types/chrome": "^0.1.40",
    "@types/node": "^20.0.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "plasmo": "^0.90.5",
    "typescript": "^6.0.3"
  },
  "manifest": {
    "name": "Gizmo AI Unlimited Hearts",
    "description": "Hides the out-of-hearts modal on Gizmo AI quizzes. Open source.",
    "author": "Alexey Fedorov",
    "host_permissions": [
      "https://app.gizmo.ai/*"
    ],
    "browser_specific_settings": {
      "gecko": {
        "id": "gizmo-ai-unlimited-hearts@gizmoai.local"
      }
    }
  }
}
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "plasmo/templates/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "ignoreDeprecations": "6.0",
    "types": ["chrome", "node"]
  },
  "include": [
    ".plasmo/index.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

- [ ] **Step 5: Install dependencies**

Run: `pnpm install`
Expected: pnpm resolves and installs everything. If pnpm is missing, run `npm install` instead — the lockfile will be `package-lock.json` rather than `pnpm-lock.yaml` but the project still builds.

- [ ] **Step 6: Verify TypeScript compiles (no source files yet, but config should parse)**

Run: `pnpm typecheck`
Expected: PASS with "no input files" or similar (acceptable since `**/*.ts` matches nothing yet). If it errors on the `tsconfig.json` itself, fix it before proceeding.

- [ ] **Step 7: Commit**

```bash
git add package.json tsconfig.json .gitignore
git commit -m "chore: scaffold Plasmo MV3 project for Gizmo AI Unlimited Hearts"
```

---

## Task 2: Pure filter-rules module + unit test

**Files:**
- Create: `contents/filter-rules.ts`
- Create: `tests/filter-rules.test.ts`

The selector list comes from the uBlock Origin Lite element picker — 4 alternative selectors that all target the "out of hearts" modal overlay on `app.gizmo.ai/quiz/*`. We combine them with commas so the rule survives if Gizmo's React Native Web class hashes change (the structural/aria selectors still catch it). Scoping to `/quiz/*` confines blast radius from the more generic selectors.

- [ ] **Step 1: Write the failing test**

Create `tests/filter-rules.test.ts`:

```typescript
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { HEARTS_MODAL_SELECTORS, buildHidingCSS } from "../contents/filter-rules.ts"

describe("HEARTS_MODAL_SELECTORS", () => {
  it("contains all 4 selectors from the uBO Lite element picker", () => {
    assert.equal(HEARTS_MODAL_SELECTORS.length, 4)
    assert.ok(HEARTS_MODAL_SELECTORS.includes(
      "div.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh.r-9daxd3.r-leqjx2.r-xx3c9p.r-6dt33c"
    ))
    assert.ok(HEARTS_MODAL_SELECTORS.includes("div:nth-of-type(4) > div > div > div > div"))
    assert.ok(HEARTS_MODAL_SELECTORS.includes("div[aria-modal][role]"))
    assert.ok(HEARTS_MODAL_SELECTORS.includes("div[tabindex][style]"))
  })
})

describe("buildHidingCSS", () => {
  it("produces a single CSS rule combining all selectors with commas", () => {
    const css = buildHidingCSS()
    assert.match(css, /^.+\{display:none !important;\}$/s)
    for (const sel of HEARTS_MODAL_SELECTORS) {
      assert.ok(css.includes(sel), `expected CSS to include selector: ${sel}`)
    }
    assert.equal((css.match(/\{/g) ?? []).length, 1, "should produce exactly one rule block")
  })

  it("uses !important so it overrides inline styles", () => {
    assert.match(buildHidingCSS(), /!important/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — module `../contents/filter-rules.ts` does not exist (resolution error).

- [ ] **Step 3: Write the minimal implementation**

Create `contents/filter-rules.ts`:

```typescript
/**
 * Cosmetic-filter selectors for the Gizmo AI "out of hearts" modal.
 *
 * Sourced from the uBlock Origin Lite element picker on app.gizmo.ai/quiz/*.
 * Four alternative selectors are kept and OR-combined so the rule survives
 * Gizmo redeploys that change React Native Web class hashes (r-*) — the
 * aria/structural selectors still catch the modal.
 */
export const HEARTS_MODAL_SELECTORS: readonly string[] = [
  "div.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh.r-9daxd3.r-leqjx2.r-xx3c9p.r-6dt33c",
  "div:nth-of-type(4) > div > div > div > div",
  "div[aria-modal][role]",
  "div[tabindex][style]"
]

export function buildHidingCSS(): string {
  return `${HEARTS_MODAL_SELECTORS.join(",")}{display:none !important;}`
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS — both `describe` blocks green, 3 tests passing.

- [ ] **Step 5: Verify typecheck still clean**

Run: `pnpm typecheck`
Expected: PASS, no errors.

- [ ] **Step 6: Commit**

```bash
git add contents/filter-rules.ts tests/filter-rules.test.ts
git commit -m "feat: add cosmetic-filter selector module with unit tests"
```

---

## Task 3: Content script — inject the hiding CSS at document_start

**Files:**
- Create: `contents/gizmo-hide.ts`

This is the Plasmo content script. It runs in the ISOLATED world at `document_start` (before any of Gizmo's scripts paint). It builds the CSS string from the pure module and inserts a `<style>` element into `documentElement`. Idempotent — guarded by a `data-*` attribute so it can't double-inject.

- [ ] **Step 1: Create the content script**

Create `contents/gizmo-hide.ts`:

```typescript
import type { PlasmoCSConfig } from "plasmo"
import { buildHidingCSS } from "./filter-rules"

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/quiz/*"],
  run_at: "document_start"
}

const MARKER = "data-gizmo-hearts-style"

function inject(): void {
  if (document.documentElement.querySelector(`style[${MARKER}]`)) return
  const style = document.createElement("style")
  style.setAttribute(MARKER, "1")
  style.textContent = buildHidingCSS()
  document.documentElement.appendChild(style)
}

if (document.documentElement) {
  inject()
} else {
  // documentElement not yet present at document_start in rare cases — wait for it
  const obs = new MutationObserver(() => {
    if (document.documentElement) {
      obs.disconnect()
      inject()
    }
  })
  obs.observe(document, { childList: true })
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: PASS, no errors. If TypeScript complains it can't find `plasmo` types, ensure `pnpm install` ran cleanly in Task 1.

- [ ] **Step 3: Commit**

```bash
git add contents/gizmo-hide.ts
git commit -m "feat: inject cosmetic-filter CSS at document_start on quiz pages"
```

---

## Task 4: Extension icon

**Files:**
- Create: `assets/icon.png`

Plasmo requires `assets/icon.png` (512×512 recommended) and auto-generates the manifest icon set from it. We generate a simple placeholder so the extension builds; you (or a designer) can swap it later.

- [ ] **Step 1: Generate a 512×512 placeholder PNG**

Run (requires ImageMagick — install via `brew install imagemagick` if missing):

```bash
mkdir -p assets
magick -size 512x512 xc:'#ec4899' \
  -fill white -gravity center -font Helvetica-Bold -pointsize 280 \
  -annotate 0 '♥' \
  assets/icon.png
```

Expected: `assets/icon.png` exists and is ~10–30 KB.

If ImageMagick isn't available, fall back to:

```bash
mkdir -p assets
curl -L -o assets/icon.png \
  "https://via.placeholder.com/512/ec4899/ffffff.png?text=GH"
```

- [ ] **Step 2: Verify the file is a valid PNG**

Run: `file assets/icon.png`
Expected: Output includes `PNG image data, 512 x 512` (or similar).

- [ ] **Step 3: Commit**

```bash
git add assets/icon.png
git commit -m "chore: add placeholder extension icon"
```

---

## Task 5: Popup UI

**Files:**
- Create: `popup.tsx`
- Create: `style.css`

A minimal informational popup — no settings, just status + GitHub link + license. Plain CSS (no Tailwind/framer-motion) keeps the bundle tiny.

- [ ] **Step 1: Create `style.css`**

```css
:root {
  color-scheme: dark;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}

body {
  margin: 0;
  background: #0f0f12;
  color: #f4f4f5;
  width: 280px;
}

.popup-root {
  padding: 18px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.popup-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.popup-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.popup-eyebrow {
  margin: 2px 0 0;
  font-size: 11px;
  color: #a1a1aa;
}

.divider {
  height: 1px;
  background: #27272a;
  margin: 4px 0;
}

.status {
  font-size: 12px;
  color: #d4d4d8;
  line-height: 1.4;
}

.status strong {
  color: #ec4899;
}

.link {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  color: #60a5fa;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.footer {
  font-size: 10px;
  color: #71717a;
  margin-top: 6px;
}
```

- [ ] **Step 2: Create `popup.tsx`**

```tsx
import logoUrl from "data-base64:./assets/icon.png"
import "./style.css"

function Popup() {
  return (
    <div className="popup-root">
      <div className="popup-header">
        <img src={logoUrl} alt="Gizmo AI Unlimited Hearts" className="popup-logo" />
        <div>
          <h1 className="popup-title">Gizmo AI Unlimited Hearts</h1>
          <p className="popup-eyebrow">v0.1.0 · open source</p>
        </div>
      </div>

      <div className="divider" />

      <p className="status">
        Active on <strong>app.gizmo.ai/quiz/*</strong>. Hides the
        out-of-hearts modal so you can keep practicing without limits.
      </p>

      <a
        className="link"
        href="https://github.com/"
        target="_blank"
        rel="noreferrer"
      >
        View source on GitHub →
      </a>

      <p className="footer">
        MPL-2.0 · Cosmetic filter only — no remote code, no tracking.
      </p>
    </div>
  )
}

export default Popup
```

- [ ] **Step 3: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: PASS. If `data-base64:` import is flagged, ensure `.plasmo/index.d.ts` was generated (it appears after the first `pnpm dev` or `pnpm build`). You can also run `pnpm dlx plasmo init` once to materialize the `.plasmo/` types directory; `pnpm build` in the next task will create it as a side effect.

- [ ] **Step 4: Commit**

```bash
git add popup.tsx style.css
git commit -m "feat: add minimal informational popup"
```

---

## Task 6: README and LICENSE

**Files:**
- Create: `README.md`
- Create: `LICENSE.txt`

Mirror the open-source-via-transparency tone from ProdigyOrigin's README, but adapted to Gizmo AI. Include ethics statement, install path, dev instructions.

- [ ] **Step 1: Create `LICENSE.txt`**

Run:

```bash
curl -L -o LICENSE.txt https://www.mozilla.org/media/MPL/2.0/index.f75d2927d3c1.txt
```

Expected: File begins with `Mozilla Public License Version 2.0`. If the URL 404s, fall back to:

```bash
curl -L -o LICENSE.txt https://raw.githubusercontent.com/mozilla/cla/master/MPL2.txt
```

Verify with: `head -3 LICENSE.txt` — first line should be the MPL header.

- [ ] **Step 2: Create `README.md`**

```markdown
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

It only hides DOM elements that are already on the page. If Gizmo's pricing or product policy changes such that this no longer aligns with their terms, the responsible use is to support them directly — see their [pricing page](https://app.gizmo.ai).

The extension exists because we believe users should be able to control what their own browser renders. Same principle as ad blockers, reading-mode extensions, and dark-mode injectors.

## Development

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
```

- [ ] **Step 3: Commit**

```bash
git add README.md LICENSE.txt
git commit -m "docs: add README with ethics statement and MPL-2.0 license"
```

---

## Task 7: Production build verification

**Files:**
- (none modified — this task verifies the build artifact)

- [ ] **Step 1: Run the production build**

Run: `pnpm build`
Expected: Plasmo prints something like `🟣 Plasmo v0.90.5` and `🟢 DONE | Finished in <Xms>`. Output appears in `build/chrome-mv3-prod/`.

If the build fails:
- Missing types? Check `pnpm install` succeeded.
- Plasmo can't find a content script? Check filenames match `contents/*.ts`.
- Manifest invalid? Re-check the `manifest` block in `package.json`.

- [ ] **Step 2: Inspect the generated manifest**

Run: `cat build/chrome-mv3-prod/manifest.json`
Expected: A valid MV3 manifest containing:
- `"name": "Gizmo AI Unlimited Hearts"`
- `"manifest_version": 3`
- A `content_scripts` entry matching `https://app.gizmo.ai/quiz/*` with `run_at: "document_start"`
- `host_permissions` including `https://app.gizmo.ai/*`
- An `action` block with `default_popup` pointing at the popup HTML
- Icons referencing the generated icon set

If any of these are missing or wrong, fix the `manifest` block in `package.json` and rebuild.

- [ ] **Step 3: Verify the content-script bundle contains the selectors**

Run: `grep -r 'aria-modal' build/chrome-mv3-prod/`
Expected: At least one match in a `.js` file under the build output. Confirms the selector strings made it into the shipped bundle.

- [ ] **Step 4: Run the full check suite**

Run these in sequence:
```bash
pnpm typecheck && pnpm test && pnpm build
```
Expected: All three exit 0.

- [ ] **Step 5: Commit (only if any lockfile or generated config changed)**

```bash
git status
# If pnpm-lock.yaml or similar changed:
git add pnpm-lock.yaml
git commit -m "chore: lockfile from production build"
# Otherwise skip the commit.
```

---

## Task 8: Manual smoke test (in-browser)

**Files:** none — this is hands-on verification.

The extension can't be meaningfully unit-tested past the pure selector module; the only way to confirm the "out of hearts" modal is hidden is to load it in a real browser. Document the smoke test so anyone reproducing this work knows what good looks like.

- [ ] **Step 1: Load the unpacked extension into Chrome**

1. Open `chrome://extensions`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select `<repo>/build/chrome-mv3-prod/`

Expected: "Gizmo AI Unlimited Hearts" appears in the extension list with no errors.

- [ ] **Step 2: Verify the popup**

Click the extension icon in the toolbar.
Expected: Popup renders with the heart icon, title, status text, GitHub link, and MPL-2.0 footer. No console errors in DevTools (right-click popup → Inspect).

- [ ] **Step 3: Verify the content script does NOT run on non-quiz pages**

Visit `https://app.gizmo.ai/` (root, not a quiz).
Open DevTools → Elements → search for `<style data-gizmo-hearts-style="1">`.
Expected: No such style tag — content script is correctly scoped.

- [ ] **Step 4: Verify the content script DOES run on quiz pages**

Visit any `https://app.gizmo.ai/quiz/<id>` URL.
Open DevTools → Elements → search for `<style data-gizmo-hearts-style="1">`.
Expected: A `<style>` element under `<html>` containing the comma-joined selectors and `display:none !important`.

- [ ] **Step 5: Verify the modal is hidden when triggered**

Take a quiz until you would normally see the "out of hearts" modal (or use a fresh account that's already at zero hearts).
Expected: The modal does not appear; the underlying quiz UI remains interactive.

- [ ] **Step 6: Watch for false positives**

While on a quiz page, browse around briefly (next question, settings, etc.) and confirm no legitimate UI elements are unexpectedly hidden. The two generic selectors (`div:nth-of-type(4) > div > div > div > div` and `div[tabindex][style]`) are the most likely culprits.

If anything legitimate disappears:
- Open `contents/filter-rules.ts`
- Comment out the offending selector in `HEARTS_MODAL_SELECTORS`
- Re-run `pnpm test` (update the test count assertion if needed) and `pnpm build`
- Re-load the extension and re-test
- Commit the narrowed filter list with a message explaining what was hiding

- [ ] **Step 7: Document smoke-test results**

If everything passed, you're done. If you narrowed the selector list in step 6, note it in the README under a new "Known issues" subsection so future contributors understand why a uBO-suggested selector is missing.

---

## Self-Review Notes

- **Spec coverage:** Plasmo framework ✓ (Task 1), only-on-quiz scoping ✓ (Task 1 manifest + Task 3 `matches`), 4-selector cosmetic filter ✓ (Task 2 selector list + Task 3 injection), open-source ethics statement ✓ (Task 6 README), naming "Gizmo AI Unlimited Hearts" ✓ (Task 1 manifest, Task 5 popup, Task 6 README).
- **Risk noted in plan:** The two generic selectors (`div:nth-of-type(4)…` and `div[tabindex][style]`) could over-match. Task 8 step 6 explicitly tests for this and documents the recovery procedure.
- **Why combine all 4:** The user's screenshot shows the uBO Lite picker output verbatim. Combining preserves robustness across Gizmo redeploys (class hashes change; aria/structural don't). Restricting to `/quiz/*` limits blast radius.
- **No background script:** Cosmetic-only extension; no DNR or network needs.
- **No test framework dep:** Uses Node's built-in `--test`. Zero added devDeps for the unit test.

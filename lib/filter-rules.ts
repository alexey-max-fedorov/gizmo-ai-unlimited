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

// Subset used by the MutationObserver — must be specific enough to never
// match quiz UI elements (answer choices, containers) that are added to the
// DOM during normal quiz flow. The two broad selectors above are fine in a
// static CSS rule but cause false positives when searched inside new nodes.
export const HEARTS_MODAL_OBSERVER_SELECTORS: readonly string[] = [
  "div.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh.r-9daxd3.r-leqjx2.r-xx3c9p.r-6dt33c",
  "div[aria-modal][role]"
]

export function buildHidingCSS(): string {
  return `${HEARTS_MODAL_SELECTORS.join(",")}{display:none !important;}`
}

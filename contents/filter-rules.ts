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

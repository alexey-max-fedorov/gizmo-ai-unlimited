/**
 * Cosmetic-filter selectors for the Gizmo AI "out of hearts" modal.
 *
 * Two selectors OR-combined: the specific r-* class chain matches the current
 * modal precisely; div[aria-modal][role] is the semantic fallback for when
 * Gizmo redeploys and changes React Native Web class hashes.
 *
 * Intentionally excluded (too broad — false-positives on quiz content):
 *   "div:nth-of-type(4) > div > div > div > div"  — matches quiz containers
 *   "div[tabindex][style]"  — matches draggable answer items in matching exercises
 */
export const HEARTS_MODAL_SELECTORS: readonly string[] = [
  "div.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh.r-9daxd3.r-leqjx2.r-xx3c9p.r-6dt33c",
  "div[aria-modal][role]"
]

// MutationObserver uses the same set — both selectors are already specific.
export const HEARTS_MODAL_OBSERVER_SELECTORS: readonly string[] = [
  "div.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh.r-9daxd3.r-leqjx2.r-xx3c9p.r-6dt33c",
  "div[aria-modal][role]"
]

export function buildHidingCSS(): string {
  return `${HEARTS_MODAL_SELECTORS.join(",")}{display:none !important;}`
}

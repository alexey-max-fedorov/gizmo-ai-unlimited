import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { HEARTS_MODAL_SELECTORS, HEARTS_MODAL_OBSERVER_SELECTORS, buildHidingCSS } from "../lib/filter-rules.ts"

describe("HEARTS_MODAL_SELECTORS", () => {
  it("contains exactly the two safe selectors", () => {
    assert.equal(HEARTS_MODAL_SELECTORS.length, 2)
    assert.ok(HEARTS_MODAL_SELECTORS.includes(
      "div.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh.r-9daxd3.r-leqjx2.r-xx3c9p.r-6dt33c"
    ))
    assert.ok(HEARTS_MODAL_SELECTORS.includes("div[aria-modal][role]"))
  })

  it("does not include broad selectors that match quiz content", () => {
    assert.ok(!HEARTS_MODAL_SELECTORS.includes("div[tabindex][style]"),
      "div[tabindex][style] hides draggable answer items in matching exercises")
    assert.ok(!HEARTS_MODAL_SELECTORS.some(s => s.includes("nth-of-type")),
      "structural nth-of-type selectors match quiz containers")
  })
})

describe("HEARTS_MODAL_OBSERVER_SELECTORS", () => {
  it("is a subset of HEARTS_MODAL_SELECTORS", () => {
    for (const sel of HEARTS_MODAL_OBSERVER_SELECTORS) {
      assert.ok(
        HEARTS_MODAL_SELECTORS.includes(sel),
        `observer selector not present in full list: ${sel}`
      )
    }
  })

  it("does not include broad structural or attribute selectors", () => {
    for (const sel of HEARTS_MODAL_OBSERVER_SELECTORS) {
      assert.ok(!sel.includes("nth-of-type"), `broad structural selector leaked into observer list: ${sel}`)
      assert.ok(sel !== "div[tabindex][style]", "div[tabindex][style] must not be in observer list")
    }
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

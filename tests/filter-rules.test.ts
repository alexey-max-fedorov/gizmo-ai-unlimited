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

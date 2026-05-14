import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PATCHED_URL, GIZMO_ENTRY_RE, isEntryScriptSrc } from "../lib/patch-config.ts";

describe("PATCHED_URL", () => {
  it("points at the raw.githubusercontent.com path for the patched bundle on main", () => {
    assert.equal(
      PATCHED_URL,
      "https://raw.githubusercontent.com/alexey-max-fedorov/gizmo-ai-unlimited/main/patcher/dist/entry.min.js"
    );
  });

  it("uses https", () => {
    assert.ok(PATCHED_URL.startsWith("https://"));
  });
});

describe("GIZMO_ENTRY_RE", () => {
  it("matches the Gizmo entry script URL with a hex hash", () => {
    assert.ok(GIZMO_ENTRY_RE.test(
      "https://app.gizmo.ai/_expo/static/js/web/entry-a7ba1bec972606400a599699bc996b57.js"
    ));
  });

  it("matches a relative entry path", () => {
    assert.ok(GIZMO_ENTRY_RE.test("/_expo/static/js/web/entry-deadbeef.js"));
  });

  it("does not match the metro-runtime or common bundles", () => {
    assert.ok(!GIZMO_ENTRY_RE.test(
      "https://app.gizmo.ai/_expo/static/js/web/__expo-metro-runtime-3959ce7b26b61ab4053a4b8b218e528d.js"
    ));
    assert.ok(!GIZMO_ENTRY_RE.test(
      "https://app.gizmo.ai/_expo/static/js/web/__common-9a3b16481e00e349bc1d3046d23f2b2a.js"
    ));
  });

  it("does not match other random scripts", () => {
    assert.ok(!GIZMO_ENTRY_RE.test("https://example.com/foo.js"));
    assert.ok(!GIZMO_ENTRY_RE.test("https://app.gizmo.ai/other.js"));
  });

  it("does not match the patched bundle URL itself", () => {
    assert.ok(!GIZMO_ENTRY_RE.test(PATCHED_URL));
  });
});

describe("isEntryScriptSrc", () => {
  it("returns true for matching URLs", () => {
    assert.equal(
      isEntryScriptSrc("https://app.gizmo.ai/_expo/static/js/web/entry-abc123.js"),
      true
    );
  });

  it("returns false for empty / undefined sources", () => {
    assert.equal(isEntryScriptSrc(""), false);
    assert.equal(isEntryScriptSrc(undefined), false);
    assert.equal(isEntryScriptSrc(null as unknown as string), false);
  });

  it("returns false for non-entry scripts", () => {
    assert.equal(isEntryScriptSrc("https://app.gizmo.ai/_expo/static/js/web/__common-x.js"), false);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PATCHES_URL,
  GIZMO_ENTRY_RE,
  isEntryScriptSrc,
  entryFilenameFromUrl
} from "../lib/patch-config.ts";

describe("PATCHES_URL", () => {
  it("points at the raw.githubusercontent.com path for patches.json on main", () => {
    assert.equal(
      PATCHES_URL,
      "https://raw.githubusercontent.com/alexey-max-fedorov/gizmo-ai-unlimited/main/patcher/dist/patches.json"
    );
  });

  it("uses https", () => {
    assert.ok(PATCHES_URL.startsWith("https://"));
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
      "https://app.gizmo.ai/_expo/static/js/web/__expo-metro-runtime-abc.js"
    ));
    assert.ok(!GIZMO_ENTRY_RE.test(
      "https://app.gizmo.ai/_expo/static/js/web/__common-abc.js"
    ));
  });

  it("does not match random scripts", () => {
    assert.ok(!GIZMO_ENTRY_RE.test("https://example.com/foo.js"));
    assert.ok(!GIZMO_ENTRY_RE.test("https://app.gizmo.ai/other.js"));
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

describe("entryFilenameFromUrl", () => {
  it("returns the filename for an absolute URL", () => {
    assert.equal(
      entryFilenameFromUrl("https://app.gizmo.ai/_expo/static/js/web/entry-abc123.js"),
      "entry-abc123.js"
    );
  });

  it("returns the filename for a relative path", () => {
    assert.equal(
      entryFilenameFromUrl("/_expo/static/js/web/entry-deadbeef.js"),
      "entry-deadbeef.js"
    );
  });

  it("strips query strings and fragments", () => {
    assert.equal(
      entryFilenameFromUrl("https://app.gizmo.ai/_expo/static/js/web/entry-abc.js?v=1"),
      "entry-abc.js"
    );
    assert.equal(
      entryFilenameFromUrl("https://app.gizmo.ai/_expo/static/js/web/entry-abc.js#x"),
      "entry-abc.js"
    );
  });

  it("returns an empty string for an unparseable input", () => {
    assert.equal(entryFilenameFromUrl(""), "");
  });
});

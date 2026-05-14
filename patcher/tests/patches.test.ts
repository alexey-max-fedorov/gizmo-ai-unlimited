import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyIsSubscribedPatch } from "../src/patches.ts";

describe("applyIsSubscribedPatch", () => {
  it("replaces the canonical getEffectiveIsSubscribed body", () => {
    const input = `foo;get isSubscribed(){return(0,r(_d[4]).getEffectiveIsSubscribed)()};bar`;
    const { output, count } = applyIsSubscribedPatch(input);
    assert.equal(count, 1);
    assert.ok(output.includes("get isSubscribed(){return true}"));
    assert.ok(!output.includes("getEffectiveIsSubscribed"));
  });

  it("replaces ALL occurrences in the file", () => {
    const input = `
      get isSubscribed(){return(0,r(d[3]).getEffectiveIsSubscribed)()}
      function other(){};
      get isSubscribed(){return(0,r(_d[4]).getEffectiveIsSubscribed)()}
    `;
    const { output, count } = applyIsSubscribedPatch(input);
    assert.equal(count, 2);
    const occurrences = output.match(/get isSubscribed\(\)\{return true\}/g)!;
    assert.equal(occurrences.length, 2);
  });

  it("reports zero matches when the pattern is absent (no throw)", () => {
    const { output, count } = applyIsSubscribedPatch("var x = 1;");
    assert.equal(count, 0);
    assert.equal(output, "var x = 1;");
  });

  it("does not match the setter (set isSubscribed)", () => {
    const input = `set isSubscribed(v){this._x=v}`;
    const { output, count } = applyIsSubscribedPatch(input);
    assert.equal(count, 0);
    assert.equal(output, input);
  });

  it("matches an empty body too", () => {
    const input = `get isSubscribed(){}`;
    const { output, count } = applyIsSubscribedPatch(input);
    assert.equal(count, 1);
    assert.ok(output.includes("get isSubscribed(){return true}"));
  });
});

import { addLoadMarkers, applyAllPatches } from "../src/patches.ts";

describe("addLoadMarkers", () => {
  it("prepends a console.log line at the start of the file", () => {
    const out = addLoadMarkers("var x=1;");
    const firstLine = out.split("\n", 1)[0];
    assert.match(firstLine, /console\.log/);
    assert.match(firstLine, /\[Gizmo Unlimited\]/);
    assert.match(firstLine, /patched bundle loaded/i);
  });

  it("appends a console.log line at the end of the file", () => {
    const out = addLoadMarkers("var x=1;");
    const lines = out.split("\n");
    const lastNonEmpty = lines.reverse().find(l => l.trim().length > 0)!;
    assert.match(lastNonEmpty, /console\.log/);
    assert.match(lastNonEmpty, /\[Gizmo Unlimited\]/);
    assert.match(lastNonEmpty, /finished executing/i);
  });

  it("preserves the original body verbatim between markers", () => {
    const body = "(function(){var x=1;})();";
    const out = addLoadMarkers(body);
    assert.ok(out.includes(body));
  });

  it("includes the patcher version string in both markers", () => {
    const out = addLoadMarkers("");
    const versionMatches = out.match(/v2\.0\.0/g) ?? [];
    assert.equal(versionMatches.length, 2);
  });
});

describe("applyAllPatches", () => {
  it("runs isSubscribed replacement and adds markers in one shot", () => {
    const input = `get isSubscribed(){return(0,r(_d[4]).getEffectiveIsSubscribed)()}`;
    const { output, isSubscribedCount } = applyAllPatches(input);
    assert.equal(isSubscribedCount, 1);
    assert.ok(output.includes("get isSubscribed(){return true}"));
    assert.match(output, /\[Gizmo Unlimited\].*patched bundle loaded/i);
    assert.match(output, /\[Gizmo Unlimited\].*finished executing/i);
  });

  it("reports the isSubscribed match count back to the caller", () => {
    const input = `
      get isSubscribed(){return a}
      get isSubscribed(){return b}
      get isSubscribed(){return c}
    `;
    const { isSubscribedCount } = applyAllPatches(input);
    assert.equal(isSubscribedCount, 3);
  });
});

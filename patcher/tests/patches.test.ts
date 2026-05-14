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

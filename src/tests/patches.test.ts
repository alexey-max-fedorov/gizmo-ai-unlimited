import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyPatchRules, wrapWithMarkers, type PatchRule } from "../lib/patches.ts";

// Mirrors the shipping patcher rule (patcher/src/patches.ts). The extension
// applies rules from patches.json at runtime; this keeps the browser-side
// applyPatchRules tested against the same shape.
const isSubscribedRule: PatchRule = {
  id: "is-subscribed",
  description: "Force isSubscribedStore reads to return true",
  find: "\\br\\(_?d\\[\\d+\\]\\)\\.isSubscribedStore\\.get\\(\\)",
  flags: "g",
  replace: "(!0)",
  minMatches: 1
};

describe("applyPatchRules", () => {
  it("replaces isSubscribedStore reads and reports counts", () => {
    const input = `foo;const u=r(d[7]).isSubscribedStore.get()??!1;bar`;
    const { output, perRuleCounts } = applyPatchRules(input, [isSubscribedRule]);
    assert.equal(perRuleCounts["is-subscribed"], 1);
    assert.ok(output.includes("(!0)??!1"));
    assert.ok(!output.includes("isSubscribedStore.get()"));
  });

  it("applies multiple rules in order", () => {
    const ruleA: PatchRule = { id: "a", description: "", find: "foo", flags: "g", replace: "FOO", minMatches: 1 };
    const ruleB: PatchRule = { id: "b", description: "", find: "bar", flags: "g", replace: "BAR", minMatches: 1 };
    const { output, perRuleCounts } = applyPatchRules("foo bar foo", [ruleA, ruleB]);
    assert.equal(output, "FOO BAR FOO");
    assert.equal(perRuleCounts["a"], 2);
    assert.equal(perRuleCounts["b"], 1);
  });

  it("reports zero matches without throwing", () => {
    const { output, perRuleCounts } = applyPatchRules("var x = 1;", [isSubscribedRule]);
    assert.equal(perRuleCounts["is-subscribed"], 0);
    assert.equal(output, "var x = 1;");
  });
});

describe("wrapWithMarkers", () => {
  it("prepends a console.log identifying the version", () => {
    const out = wrapWithMarkers("var x=1;", "2.2.0");
    const firstLine = out.split("\n", 1)[0];
    assert.match(firstLine, /console\.log/);
    assert.match(firstLine, /\[Gizmo Unlimited\]/);
    assert.match(firstLine, /patched bundle loaded/i);
    assert.match(firstLine, /v2\.2\.0/);
  });

  it("appends a console.log identifying the version", () => {
    const out = wrapWithMarkers("var x=1;", "2.2.0");
    const lines = out.split("\n").reverse();
    const lastNonEmpty = lines.find((l) => l.trim().length > 0)!;
    assert.match(lastNonEmpty, /console\.log/);
    assert.match(lastNonEmpty, /finished executing/i);
    assert.match(lastNonEmpty, /v2\.2\.0/);
  });

  it("preserves the original body verbatim between markers", () => {
    const body = "(function(){var x=1;})();";
    const out = wrapWithMarkers(body, "2.2.0");
    assert.ok(out.includes(body));
  });
});

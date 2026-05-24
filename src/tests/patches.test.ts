import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyPatchRules, wrapWithMarkers, type PatchRule, type AppendRule, type PrependRule } from "../lib/patches.ts";

const isSubscribedRule: PatchRule = {
  id: "is-subscribed",
  description: "Force isSubscribed getter to return true",
  find: "\\bget isSubscribed\\(\\)\\{[^}]*\\}",
  flags: "g",
  replace: "get isSubscribed(){return true}",
  minMatches: 1
};

describe("applyPatchRules", () => {
  it("replaces matched bodies and reports counts", () => {
    const input = `foo;get isSubscribed(){return X};bar`;
    const { output, perRuleCounts } = applyPatchRules(input, [isSubscribedRule]);
    assert.equal(perRuleCounts["is-subscribed"], 1);
    assert.ok(output.includes("get isSubscribed(){return true}"));
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

describe("applyPatchRules — append/prepend", () => {
  it("appends code at the end of the source", () => {
    const rule: AppendRule = { type: "append", id: "foot", description: "", code: "// footer" };
    const { output, perRuleCounts } = applyPatchRules("var x=1;", [rule]);
    assert.ok(output.startsWith("var x=1;"));
    assert.ok(output.endsWith("// footer"));
    assert.equal(perRuleCounts["foot"], 1);
  });

  it("prepends code at the start of the source", () => {
    const rule: PrependRule = { type: "prepend", id: "head", description: "", code: "// header" };
    const { output, perRuleCounts } = applyPatchRules("var x=1;", [rule]);
    assert.ok(output.startsWith("// header"));
    assert.ok(output.includes("var x=1;"));
    assert.equal(perRuleCounts["head"], 1);
  });

  it("append and prepend are applied in rule order alongside replace", () => {
    const rules: PatchRule[] = [
      { type: "prepend", id: "pre", description: "", code: "PRE" },
      { id: "sub", description: "", find: "x", flags: "g", replace: "X", minMatches: 1 },
      { type: "append", id: "app", description: "", code: "APP" }
    ];
    const { output } = applyPatchRules("axb", rules);
    assert.ok(output.startsWith("PRE\n"));
    assert.ok(output.includes("aXb"));
    assert.ok(output.endsWith("\nAPP"));
  });

  it("a rule with no type field behaves as replace (backwards compat)", () => {
    const rule: PatchRule = { id: "r", description: "", find: "a", flags: "g", replace: "b", minMatches: 1 };
    const { output, perRuleCounts } = applyPatchRules("aaa", [rule]);
    assert.equal(output, "bbb");
    assert.equal(perRuleCounts["r"], 3);
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

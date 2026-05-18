import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RULES, applyRules, hashRules, type PatchRule } from "../src/patches.ts";

describe("RULES", () => {
  it("includes the is-subscribed rule", () => {
    const ids = RULES.map((r) => r.id);
    assert.ok(ids.includes("is-subscribed"));
  });

  it("each rule declares id, find, flags, replace, minMatches", () => {
    for (const rule of RULES) {
      assert.equal(typeof rule.id, "string");
      assert.equal(typeof rule.description, "string");
      assert.equal(typeof rule.find, "string");
      assert.equal(typeof rule.flags, "string");
      assert.equal(typeof rule.replace, "string");
      assert.equal(typeof rule.minMatches, "number");
    }
  });
});

describe("applyRules", () => {
  const rule: PatchRule = {
    id: "is-subscribed",
    description: "Force isSubscribed getter to return true",
    find: "\\bget isSubscribed\\(\\)\\{[^}]*\\}",
    flags: "g",
    replace: "get isSubscribed(){return true}",
    minMatches: 1
  };

  it("replaces the canonical getEffectiveIsSubscribed body", () => {
    const input = `foo;get isSubscribed(){return(0,r(_d[4]).getEffectiveIsSubscribed)()};bar`;
    const { output, perRuleCounts } = applyRules(input, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 1);
    assert.ok(output.includes("get isSubscribed(){return true}"));
    assert.ok(!output.includes("getEffectiveIsSubscribed"));
  });

  it("replaces ALL occurrences in the file", () => {
    const input = `
      get isSubscribed(){return(0,r(d[3]).getEffectiveIsSubscribed)()}
      function other(){};
      get isSubscribed(){return(0,r(_d[4]).getEffectiveIsSubscribed)()}
    `;
    const { perRuleCounts } = applyRules(input, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 2);
  });

  it("reports zero matches when the pattern is absent (no throw)", () => {
    const { output, perRuleCounts } = applyRules("var x = 1;", [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 0);
    assert.equal(output, "var x = 1;");
  });

  it("does not match the setter (set isSubscribed)", () => {
    const { perRuleCounts } = applyRules(`set isSubscribed(v){this._x=v}`, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 0);
  });

  it("matches an empty body too", () => {
    const { output, perRuleCounts } = applyRules(`get isSubscribed(){}`, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 1);
    assert.ok(output.includes("get isSubscribed(){return true}"));
  });

  it("applies multiple rules in sequence", () => {
    const ruleA: PatchRule = { id: "a", description: "", find: "foo", flags: "g", replace: "FOO", minMatches: 1 };
    const ruleB: PatchRule = { id: "b", description: "", find: "bar", flags: "g", replace: "BAR", minMatches: 1 };
    const { output, perRuleCounts } = applyRules("foo bar foo", [ruleA, ruleB]);
    assert.equal(output, "FOO BAR FOO");
    assert.equal(perRuleCounts["a"], 2);
    assert.equal(perRuleCounts["b"], 1);
  });
});

describe("hashRules", () => {
  it("returns a 16-char hex string", () => {
    const hash = hashRules(RULES);
    assert.equal(hash.length, 16);
    assert.match(hash, /^[0-9a-f]{16}$/);
  });

  it("is deterministic for the same input", () => {
    assert.equal(hashRules(RULES), hashRules(RULES));
  });

  it("changes when rules change", () => {
    const ruleA: PatchRule = { id: "a", description: "", find: "x", flags: "g", replace: "y", minMatches: 1 };
    const ruleB: PatchRule = { id: "b", description: "", find: "x", flags: "g", replace: "z", minMatches: 1 };
    assert.notEqual(hashRules([ruleA]), hashRules([ruleB]));
  });
});

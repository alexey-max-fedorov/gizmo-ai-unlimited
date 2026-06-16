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
  // Exercise the ACTUAL shipping rule against representative live-bundle shapes,
  // so a future upstream shape change that breaks it fails here too.
  const rule = RULES.find((r) => r.id === "is-subscribed")!;

  it("forces an isSubscribedStore.get() read to (!0)", () => {
    const input = `d=async function(s){const u=r(d[7]).isSubscribedStore.get()??!1;return u}`;
    const { output, perRuleCounts } = applyRules(input, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 1);
    assert.ok(output.includes("const u=(!0)??!1;"));
    assert.ok(!output.includes("isSubscribedStore.get()"));
  });

  it("replaces ALL read sites, including the _d require variant", () => {
    const input = [
      `if(e!==r(d[9]).isSubscribedStore.get()&&z){}`,
      `const u=r(_d[7]).isSubscribedStore.get()??!1;`,
      `u=()=>(r(d[0]).isSubscribedStore.get()??!1)||n.get();`
    ].join("\n");
    const { output, perRuleCounts } = applyRules(input, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 3);
    assert.ok(!output.includes("isSubscribedStore.get()"));
  });

  it("produces syntactically valid JS (the ??/&&/|| operators stay intact)", () => {
    // A naive `||!0` append would form the illegal `get()||!0??!1` mix and break
    // the whole bundle. `(!0)` is a self-contained primary expression, so the
    // surrounding `??!1` stays valid. Guard against regressing to that mistake.
    const input = `const u=r(d[7]).isSubscribedStore.get()??!1;const v=(r(d[0]).isSubscribedStore.get()??!1)||0;`;
    const { output } = applyRules(input, [rule]);
    assert.ok(output.includes("(!0)??!1"));
    assert.doesNotThrow(() => new Function(output));
  });

  it("does not touch isSubscribedStore.set() or plain isSubscribed refs", () => {
    const input = `r(d[9]).isSubscribedStore.set(x);const{isSubscribed:o}=p();e.isSubscribed;`;
    const { output, perRuleCounts } = applyRules(input, [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 0);
    assert.equal(output, input);
  });

  it("reports zero matches when the pattern is absent (no throw)", () => {
    const { output, perRuleCounts } = applyRules("var x = 1;", [rule]);
    assert.equal(perRuleCounts["is-subscribed"], 0);
    assert.equal(output, "var x = 1;");
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

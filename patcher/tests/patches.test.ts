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

  it("expands $1/$2 backreferences in replace", () => {
    const rule: PatchRule = {
      id: "swap",
      description: "swap a,b -> b,a",
      find: "X\\((\\w+),(\\w+)\\)",
      flags: "g",
      replace: "X($2,$1)",
      minMatches: 1
    };
    const { output, perRuleCounts } = applyRules("X(foo,bar) X(baz,qux)", [rule]);
    assert.equal(output, "X(bar,foo) X(qux,baz)");
    assert.equal(perRuleCounts["swap"], 2);
  });
});

describe("followup-revive rule", () => {
  const rule = RULES.find((r) => r.id === "followup-revive")!;
  // Real minified snippets (large + small screen), differing only in
  // list var (f/x) and sendMessage var (l/n).
  const large =
    "(0,r(d[6]).useMemo)(()=>{const e=[...f].reverse().find(e=>'assistant'===e.role);return e?(0,r(d[15]).extractFollowupQuestions)(e):[]},[f]),(0,r(d[6]).useCallback)(e=>{l({message:{role:'user',parts:[{type:'text',text:e}]}})},[l]);";
  const small =
    "(0,r(d[6]).useMemo)(()=>{const e=[...x].reverse().find(e=>'assistant'===e.role);return e?(0,r(d[15]).extractFollowupQuestions)(e):[]},[x]),(0,r(d[6]).useCallback)(e=>{n({message:{role:'user',parts:[{type:'text',text:e}]}})},[n]);";

  it("rebinds both dead hooks to named consts in both components", () => {
    const { output, perRuleCounts } = applyRules(large + small, [rule]);
    assert.equal(perRuleCounts["followup-revive"], 2);
    // const __fq=<useMemo>,__fqAsk=<useCallback>;
    assert.ok(output.includes("const __fq=(0,r(d[6]).useMemo)(()=>{const e=[...f]"));
    assert.ok(output.includes("__fqAsk=(0,r(d[6]).useCallback)(e=>{l("));
    assert.ok(output.includes("const __fq=(0,r(d[6]).useMemo)(()=>{const e=[...x]"));
    assert.ok(output.includes("__fqAsk=(0,r(d[6]).useCallback)(e=>{n("));
    // No leftover bare-expression form
    assert.ok(!output.includes("[]},[f]),(0,r(d[6]).useCallback)"));
  });
});

describe("followup-render rule", () => {
  const rule = RULES.find((r) => r.id === "followup-render")!;
  const largeSlot =
    "(0,r(d[8]).jsx)(r(d[19]).ELI5Button,{event:{event:'UNDERSTAND_ENGAGEMENT_ELI5'},className:\"mx-auto max-w-screen-md w-full mt-2\",onPress:()=>{l({message:{role:'user',parts:[{type:'text',text:S(r(d[19]).ELI5_AI_MESSAGE)}]}})}}),null]";
  const smallSlot =
    "(0,r(d[8]).jsx)(r(d[19]).ELI5Button,{event:{event:'UNDERSTAND_ENGAGEMENT_ELI5'},className:\"mx-auto max-w-screen-md w-full mt-2\",onPress:()=>{n({message:{role:'user',parts:[{type:'text',text:w(r(d[19]).ELI5_AI_MESSAGE)}]}})}}),null]";

  it("swaps the orphaned null slot for SuggestedQuestions in both components", () => {
    const { output, perRuleCounts } = applyRules(largeSlot + smallSlot, [rule]);
    assert.equal(perRuleCounts["followup-render"], 2);
    // ELI5 button onPress preserved (var names intact)
    assert.ok(output.includes("text:S(r(d[19]).ELI5_AI_MESSAGE)}]}})}})"));
    assert.ok(output.includes("text:w(r(d[19]).ELI5_AI_MESSAGE)}]}})}})"));
    // null slot replaced with SuggestedQuestions wired to revived consts
    assert.ok(!output.includes(")}}),null]"));
    assert.ok(
      output.includes(
        ")}}),(0,r(d[8]).jsx)(r(d[15]).SuggestedQuestions,{questions:__fq,onSelectQuestion:__fqAsk,className:\"mx-auto max-w-screen-md w-full mt-2\"})]"
      )
    );
  });
});

describe("followup-render-chat rule", () => {
  const rule = RULES.find((r) => r.id === "followup-render-chat")!;
  // Real minified snippet: the active-message EngagementOptions render inside
  // component x of ChatMessage.tsx (module 5673). n=message, l=sendMessage.
  const slot =
    "W=a&&!y&&!n.message_still_generating&&(0,r(d[7]).jsx)(j,{message:n,sendMessage:l}),t[31]=a,t[32]=y";

  it("wraps the EngagementOptions render and appends SuggestedQuestions", () => {
    const { output, perRuleCounts } = applyRules(slot, [rule]);
    assert.equal(perRuleCounts["followup-render-chat"], 1);
    // Original engagement render preserved, now first child of a Fragment.
    assert.ok(
      output.includes(
        "message_still_generating&&(0,r(d[7]).jsxs)(r(d[7]).Fragment,{children:[(0,r(d[7]).jsx)(j,{message:n,sendMessage:l}),"
      )
    );
    // Followups computed from the message via the chat module's global id (5667).
    assert.ok(
      output.includes(
        "(0,r(d[7]).jsx)(r(5667).SuggestedQuestions,{questions:(0,r(5667).extractFollowupQuestions)(n),onSelectQuestion:q=>l({message:{role_id:r(d[20]).TUTOR_ROLE_IDS.user,message:q,json_input:null,section_type:'CUSTOM_USER_QUESTION'},deleteMessagesAfterThisId:n.id}),className:\"px-4 mt-2\"})]})"
      )
    );
    // Trailing memo assignments untouched.
    assert.ok(output.includes("]}),t[31]=a,t[32]=y"));
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

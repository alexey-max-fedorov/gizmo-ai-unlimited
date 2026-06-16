import { createHash } from "node:crypto";

export type PatchRule = {
  id: string;
  description: string;
  find: string;     // RegExp source (no surrounding slashes)
  flags: string;    // RegExp flags (must include "g" for replace-all semantics)
  replace: string;
  minMatches: number;
};

// Rules applied IN ORDER to the original bundle. Each rule is a regex find/replace.
// Tightly anchor your patterns — see `.claude/gotchas.md`.
export const RULES: ReadonlyArray<PatchRule> = [
  {
    id: "is-subscribed",
    description: "Force isSubscribedStore reads to return true",
    // The old `get isSubscribed(){...}` getter is gone; subscription state now
    // lives in a store read via Metro inline-require as
    // `r(d[N]).isSubscribedStore.get()` (also the documented `r(_d[N])` variant).
    // Replace the whole read-expression with `(!0)` so every consumer sees
    // subscribed=true. `(!0)` is a self-contained primary expression — it keeps
    // the surrounding `??!1` / `&&` / `||` operators valid (a bare `||!0` append
    // would form the illegal `||...??` mix and break the bundle).
    find: "\\br\\(_?d\\[\\d+\\]\\)\\.isSubscribedStore\\.get\\(\\)",
    flags: "g",
    replace: "(!0)",
    minMatches: 1
  },
  {
    id: "subscription-status",
    description: "Force the game-state subscription status check to 'subscribed' (unlimited hearts/hints, no cooldown, no life/hint consumption)",
    // This is what ACTUALLY drives unlimited. The quiz game-state class gates
    // hearts/hints/cooldown on a state-machine snapshot:
    //   get availableHints(){return 'subscribed'===<sm>.state.snapshot?.subscription?.status ? 1/0 : <count>}
    //   get hearts(){const e='subscribed'===<sm>...status, i=e?1/0:<count>}
    //   get cooldown(){if('subscribed'===<sm>...status) return null; ...}
    //   loseLife(){'subscribed'===<sm>...status || (<decrement>)}
    // `1/0` is Infinity, and the HUD renders `v>9999?'∞':v` → shows ∞.
    // `<sm>` is a Babel private-field read `(0,X.default)(this,Y)[Y]` (minified
    // var names vary, e.g. t/b and s/v across the two bundled copies — hence the
    // `[\w$]+` placeholders). Replace the whole `'subscribed'===<expr>` compare
    // with `(!0)`; it stays valid in every context (`?1/0:`, `||(...)`, `!(...)`,
    // `if(...)`, bare assignment). NOTE: isSubscribedStore (above) is a SEPARATE
    // mechanism (paywall UI) and does NOT gate game mechanics — both are needed.
    find: "'subscribed'===\\(0,[\\w$]+\\.default\\)\\(this,[\\w$]+\\)\\[[\\w$]+\\]\\.state\\.snapshot\\?\\.subscription\\?\\.status",
    flags: "g",
    replace: "(!0)",
    minMatches: 1
  }
];

export type ApplyRulesOutcome = {
  output: string;
  perRuleCounts: Record<string, number>;
};

export const applyRules = (
  source: string,
  rules: ReadonlyArray<PatchRule>
): ApplyRulesOutcome => {
  const perRuleCounts: Record<string, number> = {};
  let output = source;
  for (const rule of rules) {
    const re = new RegExp(rule.find, rule.flags);
    let count = 0;
    output = output.replace(re, () => {
      count += 1;
      return rule.replace;
    });
    perRuleCounts[rule.id] = count;
  }
  return { output, perRuleCounts };
};

export const hashRules = (rules: ReadonlyArray<PatchRule>): string => {
  const canonical = JSON.stringify(rules);
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
};

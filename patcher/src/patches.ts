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
  },
  {
    id: "import-cooldown",
    description: "Force the Magic Import cooldown check to inactive (unlimited imports)",
    // Free accounts don't get a hard import COUNT — they get a per-import time
    // COOLDOWN ("import once, then wait N hours"). The client gates every import
    // trigger on `isImportCooldownActive(endTime)` plus an inlined copy inside
    // the ImportButton controller, both shaped:
    //   null!=<t>&&Date.parse(<t>)>Date.now()&&'true'!==r(d[N]).env.EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN
    // (`EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN` is a dev bypass flag that defaults
    // falsy, so the cooldown is on for everyone.) Replace the whole boolean with
    // `(!1)` so the cooldown always reads inactive → imports never blocked.
    // Anchored on the unique SKIP_IMPORT_COOLDOWN literal; the `\1` backref keeps
    // the two var reads identical; `r(d[N])`/`r(_d[N])` require forms and `'`/`"`
    // quote styles are both covered. `(!1)` is a self-contained false primary —
    // valid as a bare `return` operand AND as an assignment RHS (`ze=(!1)`), same
    // rationale as the `(!0)` rules above. NOTE: this is the CLIENT cooldown gate;
    // if a future check finds the acquire endpoint also rejects server-side, this
    // unblocks the UI but the import may still error (see issue #33 notes).
    find: "null!=([\\w$]+)&&Date\\.parse\\(\\1\\)>Date\\.now\\(\\)&&['\"]true['\"]!==r\\(_?d\\[\\d+\\]\\)\\.env\\.EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN",
    flags: "g",
    replace: "(!1)",
    minMatches: 2
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

import { createHash } from "node:crypto";

export type ReplaceRule = {
  type?: "replace";   // optional — absent means replace (backwards compat)
  id: string;
  description: string;
  find: string;       // RegExp source (no surrounding slashes)
  flags: string;      // RegExp flags (must include "g" for replace-all semantics)
  replace: string;
  minMatches: number;
};

export type AppendRule = {
  type: "append";
  id: string;
  description: string;
  code: string;
};

export type PrependRule = {
  type: "prepend";
  id: string;
  description: string;
  code: string;
};

export type PatchRule = ReplaceRule | AppendRule | PrependRule;

// Rules applied IN ORDER to the original bundle. Each rule is a regex find/replace.
// Tightly anchor your patterns — see `.claude/gotchas.md`.
export const RULES: ReadonlyArray<PatchRule> = [
  {
    id: "is-subscribed",
    description: "Force isSubscribed getter to return true",
    // \bget isSubscribed(){<body without '}'>} — observed bodies are simple
    // `return(0,r(_d[N]).getEffectiveIsSubscribed)()`.
    find: "\\bget isSubscribed\\(\\)\\{[^}]*\\}",
    flags: "g",
    replace: "get isSubscribed(){return true}",
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
    switch (rule.type ?? "replace") {
      case "replace": {
        const re = new RegExp((rule as ReplaceRule).find, (rule as ReplaceRule).flags);
        let count = 0;
        output = output.replace(re, () => { count += 1; return (rule as ReplaceRule).replace; });
        perRuleCounts[rule.id] = count;
        break;
      }
      case "append":
        output = output + "\n" + (rule as AppendRule).code;
        perRuleCounts[rule.id] = 1;
        break;
      case "prepend":
        output = (rule as PrependRule).code + "\n" + output;
        perRuleCounts[rule.id] = 1;
        break;
    }
  }
  return { output, perRuleCounts };
};

export const hashRules = (rules: ReadonlyArray<PatchRule>): string => {
  const canonical = JSON.stringify(rules);
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
};

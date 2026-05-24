export type ReplaceRule = {
  type?: "replace";   // optional — absent means replace (backwards compat)
  id: string;
  description: string;
  find: string;       // RegExp source
  flags: string;      // RegExp flags
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

export type ApplyPatchRulesOutcome = {
  output: string;
  perRuleCounts: Record<string, number>;
};

export const applyPatchRules = (
  source: string,
  rules: ReadonlyArray<PatchRule>
): ApplyPatchRulesOutcome => {
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

export const wrapWithMarkers = (source: string, version: string): string => {
  const prefix = `console.log("[Gizmo Unlimited] patched bundle loaded (v${version})");\n`;
  const suffix = `\nconsole.log("[Gizmo Unlimited] patched bundle finished executing (v${version})");\n`;
  return `${prefix}${source}${suffix}`;
};

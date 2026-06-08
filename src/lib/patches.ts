export type PatchRule = {
  id: string;
  description: string;
  find: string;     // RegExp source
  flags: string;    // RegExp flags
  replace: string;
  minMatches: number;
};

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
    const matches = output.match(new RegExp(rule.find, rule.flags));
    perRuleCounts[rule.id] = matches ? matches.length : 0;
    output = output.replace(new RegExp(rule.find, rule.flags), rule.replace);
  }
  return { output, perRuleCounts };
};

export const wrapWithMarkers = (source: string, version: string): string => {
  const prefix = `console.log("[Gizmo Unlimited] patched bundle loaded (v${version})");\n`;
  const suffix = `\nconsole.log("[Gizmo Unlimited] patched bundle finished executing (v${version})");\n`;
  return `${prefix}${source}${suffix}`;
};

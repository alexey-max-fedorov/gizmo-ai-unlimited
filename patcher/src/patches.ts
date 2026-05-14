import { VERSION } from "./constants.ts";

// Match: `get isSubscribed(){<anything that doesn't contain '}'>}`.
// Observed bodies are simple `return (0,r(_d[N]).getEffectiveIsSubscribed)()`,
// so [^}]* is sufficient. \b on the leading `get` keeps us from matching
// substring collisions like `forget isSubscribed`.
const IS_SUBSCRIBED_RE = /\bget isSubscribed\(\)\{[^}]*\}/g;

export type PatchOutcome = { output: string; count: number };

export const applyIsSubscribedPatch = (source: string): PatchOutcome => {
  let count = 0;
  const output = source.replace(IS_SUBSCRIBED_RE, () => {
    count += 1;
    return "get isSubscribed(){return true}";
  });
  return { output, count };
};

export const addLoadMarkers = (source: string): string => {
  const prefix = `console.log("[Gizmo Unlimited] patched bundle loaded (patcher v${VERSION})");\n`;
  const suffix = `\nconsole.log("[Gizmo Unlimited] patched bundle finished executing (patcher v${VERSION})");\n`;
  return `${prefix}${source}${suffix}`;
};

export type AllPatchesOutcome = {
  output: string;
  isSubscribedCount: number;
};

export const applyAllPatches = (source: string): AllPatchesOutcome => {
  const { output: afterIsSubscribed, count: isSubscribedCount } = applyIsSubscribedPatch(source);
  const output = addLoadMarkers(afterIsSubscribed);
  return { output, isSubscribedCount };
};

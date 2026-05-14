export const PATCHED_URL =
  "https://raw.githubusercontent.com/alexey-max-fedorov/gizmo-ai-unlimited/main/patcher/dist/entry.min.js";

// Matches absolute or relative entry.js URLs with a lowercase hex hash.
// The leading boundary is "/web/" so we don't accidentally match
// "...metro-runtime-..." or "...__common-...".
export const GIZMO_ENTRY_RE = /\/_expo\/static\/js\/web\/entry-[a-f0-9]+\.js(?:\?|#|$)/i;

export const isEntryScriptSrc = (src: string | null | undefined): boolean => {
  if (!src) return false;
  return GIZMO_ENTRY_RE.test(src);
};

export const PATCHES_URL =
  "https://raw.githubusercontent.com/alexey-max-fedorov/gizmo-ai-unlimited/main/patcher/dist/patches.json";

// Matches absolute or relative entry.js URLs with a lowercase hex hash.
// The leading boundary is "/web/" so we don't accidentally match
// "...metro-runtime-..." or "...__common-...".
export const GIZMO_ENTRY_RE = /\/_expo\/static\/js\/web\/entry-[a-f0-9]+\.js(?:\?|#|$)/i;

export const isEntryScriptSrc = (src: string | null | undefined): boolean => {
  if (!src) return false;
  return GIZMO_ENTRY_RE.test(src);
};

export const entryFilenameFromUrl = (urlOrPath: string): string => {
  if (!urlOrPath) return "";
  // Strip query/fragment, then take the basename.
  const cleaned = urlOrPath.split("?")[0].split("#")[0];
  const lastSlash = cleaned.lastIndexOf("/");
  return lastSlash === -1 ? cleaned : cleaned.slice(lastSlash + 1);
};

// Plasmo replaces `process.env.PLASMO_PUBLIC_*` with string literals at build
// time, so `process` is never read at runtime in the browser. This ambient
// declaration only satisfies the typechecker (the extension tsconfig loads
// `chrome` types, not `node`).
declare const process: { env: Record<string, string | undefined> };

// Source of truth for the patch rules the extension applies. In production this
// points at the committed patches.json on the repo's `main` branch. For local
// development against a freshly-built patcher output, set PLASMO_PUBLIC_PATCHES_URL
// (e.g. to a CORS-enabled localhost static server serving patcher/dist/patches.json);
// Plasmo inlines it at build time. Unset (tests / prod build) → the main-branch URL.
export const PATCHES_URL =
  process.env.PLASMO_PUBLIC_PATCHES_URL ||
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

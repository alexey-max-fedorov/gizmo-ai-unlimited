export const VERSION = "2.1.0";

// The URL the patcher fetches to discover the current entry-*.js hash.
// A specific quiz URL is used because Gizmo's root page may redirect to login.
export const GIZMO_PROBE_URL = "https://app.gizmo.ai/quiz/198926301";

// Origin used to resolve the relative entry-*.js href into an absolute URL.
export const GIZMO_ORIGIN = "https://app.gizmo.ai";

// Gizmo serves a bot-detection HTML stub if the User-Agent looks scripted.
// A realistic Chrome UA bypasses that check.
export const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Network timeout for HTTP fetches.
export const FETCH_TIMEOUT_MS = 30_000;

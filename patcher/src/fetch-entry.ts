import { FETCH_TIMEOUT_MS, GIZMO_ORIGIN, GIZMO_PROBE_URL, USER_AGENT } from "./constants.ts";

// Matches: <script ... src="/_expo/static/js/web/entry-{hex}.js" ...></script>
// Order-insensitive: src may come before or after defer.
const ENTRY_SCRIPT_RE = /<script\b[^>]*\bsrc=["'](\/_expo\/static\/js\/web\/entry-[a-f0-9]+\.js)["'][^>]*>/i;

export const extractEntryUrl = (html: string): string => {
  const match = html.match(ENTRY_SCRIPT_RE);
  if (!match?.[1]) {
    throw new Error(
      "Could not locate <script src=\"/_expo/static/js/web/entry-*.js\"> in fetched HTML. " +
      "The page structure may have changed, or bot detection returned a stub."
    );
  }
  return match[1];
};

export const fetchHtml = async (url: string = GIZMO_PROBE_URL): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchEntryBundle = async (entryPath: string): Promise<string> => {
  const url = entryPath.startsWith("http") ? entryPath : `${GIZMO_ORIGIN}${entryPath}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} fetching ${url}`);
    }
    const body = await response.text();
    if (body.length < 1000) {
      throw new Error(`Fetched bundle suspiciously small (${body.length} bytes) — likely an error page.`);
    }
    return body;
  } finally {
    clearTimeout(timeoutId);
  }
};

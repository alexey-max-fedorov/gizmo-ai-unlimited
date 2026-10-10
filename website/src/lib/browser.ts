import { GET_PATH, SHORTLINKS } from "./constants";

export type BrowserId = "chrome" | "edge" | "firefox";

/**
 * Best-effort browser detection from a user-agent string.
 * Order matters: Edge UAs also contain "Chrome", so check Edge first.
 * Brave is intentionally indistinguishable from Chrome and maps to "chrome".
 */
export function detectBrowser(userAgent: string): BrowserId {
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "edge";
  if (ua.includes("firefox/")) return "firefox";
  if (ua.includes("chrome/") || ua.includes("crios/")) return "chrome";
  return "chrome";
}

/**
 * Where the primary install button should go for a browser. Chromium browsers
 * (Chrome, Edge, Brave) land on /get because their store listings are down;
 * Firefox goes to its live Add-ons listing.
 */
export function installLink(browser: BrowserId): { href: string; external: boolean } {
  return browser === "firefox"
    ? { href: SHORTLINKS.firefox, external: true }
    : { href: GET_PATH, external: false };
}

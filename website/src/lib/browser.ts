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

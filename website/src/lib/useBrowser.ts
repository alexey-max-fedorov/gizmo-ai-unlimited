"use client";

import { useEffect, useState } from "react";
import { detectBrowser, type BrowserId } from "./browser";

/** Short, human label for the detected browser (used in CTAs like "Add to Edge"). */
const labels: Record<BrowserId, string> = {
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
};

export interface BrowserInfo {
  browser: BrowserId;
  label: string;
}

/**
 * Client hook wrapping the pure {@link detectBrowser}. Defaults to "chrome"
 * for SSR/first paint, then resolves the real browser after mount to avoid a
 * hydration mismatch.
 */
export function useBrowser(): BrowserInfo {
  const [browser, setBrowser] = useState<BrowserId>("chrome");

  useEffect(() => {
    setBrowser(detectBrowser(navigator.userAgent));
  }, []);

  return { browser, label: labels[browser] };
}

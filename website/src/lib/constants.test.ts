import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import {
  CHROME_MANUAL_INSTALL,
  EDGE_MANUAL_INSTALL,
  GET_PATH,
  SITE,
  STORES,
  FEATURES,
  STEPS,
  INSTALL,
  FAQ,
  STATS,
} from "./constants";

const extensionPackage = JSON.parse(
  readFileSync(new URL("../../../package.json", import.meta.url), "utf8"),
) as { version: string };

describe("constants integrity", () => {
  it("exposes the canonical site facts", () => {
    expect(SITE.name).toBe("Gizmo AI Unlimited");
    expect(SITE.url).toBe("https://gizmo.best");
    expect(SITE.version).toBe(extensionPackage.version);
    expect(SITE.tagline).toBe("Study Without Limits");
  });

  it("keeps the reference store URLs on the right domains", () => {
    expect(STORES.chrome).toContain("chromewebstore.google.com");
    expect(STORES.edge).toContain("microsoftedge.microsoft.com");
    expect(STORES.firefox).toContain("addons.mozilla.org");
  });

  it("sends Chrome installs to /get and the v2.2.0 release", () => {
    const chrome = INSTALL.find((target) => target.browser === "chrome");
    expect(chrome?.href).toBe(GET_PATH);
    expect(chrome?.href).not.toContain("chromewebstore");
    expect(CHROME_MANUAL_INSTALL).toBe(
      "https://github.com/alexey-max-fedorov/gizmo-ai-unlimited/releases/tag/v2.2.0",
    );
  });

  it("sends Edge installs to /get and the same Chromium release", () => {
    const edge = INSTALL.find((target) => target.browser === "edge");
    expect(edge?.href).toBe(GET_PATH);
    expect(edge?.note).toContain("Temporarily unavailable");
    expect(EDGE_MANUAL_INSTALL).toBe(CHROME_MANUAL_INSTALL);
  });

  it("only links Firefox as an official store", () => {
    const stores = INSTALL.filter((target) => target.href.startsWith("http"));
    expect(stores.map((target) => target.browser)).toEqual(["firefox"]);
    const copy = JSON.stringify(FAQ);
    expect(copy).not.toContain("microsoftedge.microsoft.com");
    expect(copy).toMatch(/Edge[^.]*temporarily unavailable|temporarily unavailable[^.]*Edge/i);
  });

  it("ships content for every section", () => {
    expect(FEATURES.length).toBe(6);
    expect(STEPS.length).toBe(3);
    expect(INSTALL.length).toBeGreaterThanOrEqual(3);
    expect(STATS.length).toBe(4);
    expect(FAQ.length).toBeGreaterThanOrEqual(6);
  });

  it("every FAQ entry has a non-empty question and answer", () => {
    for (const item of FAQ) {
      expect(item.q.length).toBeGreaterThan(0);
      expect(item.a.length).toBeGreaterThan(0);
    }
  });
});

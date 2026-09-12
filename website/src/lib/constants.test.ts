import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { SITE, STORES, FEATURES, STEPS, INSTALL, FAQ, STATS } from "./constants";

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

  it("has all three store URLs on the right domains", () => {
    expect(STORES.chrome).toContain("chromewebstore.google.com");
    expect(STORES.edge).toContain("microsoftedge.microsoft.com");
    expect(STORES.firefox).toContain("addons.mozilla.org");
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

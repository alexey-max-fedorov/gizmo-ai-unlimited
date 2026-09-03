import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as constants from "./constants";
import { softwareAppSchema } from "./schema";

const { FAQ, FEATURES, SITE, STATS, STEPS } = constants;

const PRIMARY_CAPABILITIES = [
  "Unlimited hearts",
  "Unlocked hints",
  "Unlimited Magic Imports (client-side cooldown check disabled)",
];

describe("unlimited Magic Imports content", () => {
  it("presents all three primary capabilities in the core site copy", () => {
    for (const copy of [SITE.oneLiner, SITE.description]) {
      expect(copy).toMatch(/unlimited hearts/i);
      expect(copy).toMatch(/unlocked hints/i);
      expect(copy).toMatch(/unlimited Magic Imports/i);
    }

    expect(SITE.description).toMatch(/Magic Import's client-side cooldown/i);
    expect(SITE.description.length).toBeLessThanOrEqual(160);
    expect(SITE.version).toBe("2.3.0");
  });

  it("keeps six feature cards and makes Magic Imports first-class", () => {
    expect(FEATURES).toHaveLength(6);

    const importsFeature = FEATURES.find(
      ({ title }) => title === "Unlimited Magic Imports",
    );
    expect(importsFeature).toBeDefined();
    expect(importsFeature?.body).toMatch(/client-side cooldown/i);
    expect(importsFeature?.body).toMatch(/activates automatically/i);
    expect(FEATURES.some(({ title }) => title === "Automatic & silent")).toBe(false);
  });

  it("includes imports in the study result and stats", () => {
    expect(STEPS.at(-1)?.body).toMatch(/Magic Import/i);
    expect(STATS.map(({ label }) => label).join(" ")).toMatch(/imports/i);
  });

  it("answers the Magic Import cooldown question conservatively", () => {
    const definition = FAQ.find(({ q }) => q === "What is Gizmo AI Unlimited?");
    expect(definition?.a).toMatch(/unlimited hearts/i);
    expect(definition?.a).toMatch(/unlocked hints/i);
    expect(definition?.a).toMatch(/unlimited Magic Imports/i);

    const cooldown = FAQ.find(
      ({ q }) => q === "Does it remove the Gizmo AI Magic Import cooldown?",
    );
    expect(cooldown).toBeDefined();
    expect(cooldown?.a).toMatch(/disables the client-side cooldown check/i);
    expect(cooldown?.a).toMatch(/server-side limits/i);
  });

  it("exposes the primary capabilities and import search variants", () => {
    const site = SITE as typeof SITE & { seoTitle?: string };
    expect(site.seoTitle).toMatch(/Gizmo AI/i);
    expect(site.seoTitle).toMatch(/hearts/i);
    expect(site.seoTitle).toMatch(/hints/i);
    expect(site.seoTitle).toMatch(/Magic Imports/i);

    const schema = softwareAppSchema() as ReturnType<typeof softwareAppSchema> & {
      featureList?: string[];
    };
    expect(schema.featureList).toEqual(PRIMARY_CAPABILITIES);

    const keywords =
      (constants as typeof constants & { SEO_KEYWORDS?: readonly string[] })
        .SEO_KEYWORDS ?? [];
    expect(keywords).toEqual(
      expect.arrayContaining([
        "Gizmo AI unlimited imports",
        "Gizmo Magic Import",
        "Gizmo import cooldown",
      ]),
    );
  });

  it("keeps the machine-readable summaries aligned", () => {
    const llms = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");
    expect(llms).toMatch(/unlimited Magic Imports/i);
    expect(llms).toMatch(/client-side cooldown/i);
    expect(llms).toMatch(/server-side limits/i);

    const manifest = JSON.parse(
      readFileSync(new URL("../../public/site.webmanifest", import.meta.url), "utf8"),
    ) as { description: string };
    expect(manifest.description).toMatch(/unlimited hearts/i);
    expect(manifest.description).toMatch(/unlocked hints/i);
    expect(manifest.description).toMatch(/unlimited Magic Imports/i);
  });
});

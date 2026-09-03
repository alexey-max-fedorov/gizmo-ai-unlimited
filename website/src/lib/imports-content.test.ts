import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FAQ,
  FEATURES,
  PRIMARY_CAPABILITIES,
  SEO_KEYWORDS,
  SITE,
  STATS,
  STEPS,
} from "./constants";
import { softwareAppSchema } from "./schema";

const CAPABILITY_PATTERNS = [
  /unlimited hearts/i,
  /unlocked hints/i,
  /unlimited Magic Imports/i,
];

function expectPrimaryCapabilities(copy: string) {
  for (const pattern of CAPABILITY_PATTERNS) {
    expect(copy).toMatch(pattern);
  }
}

function expectQuizScope(copy: string) {
  expect(copy).toMatch(/hearts.*hints.*Gizmo AI quizzes/i);
}

describe("unlimited Magic Imports content", () => {
  it("presents all three primary capabilities in the core site copy", () => {
    expectPrimaryCapabilities(SITE.oneLiner);
    expectPrimaryCapabilities(SITE.description);
    expectQuizScope(SITE.oneLiner);
    expectQuizScope(SITE.description);
    expect(SITE.description).toMatch(/Magic Import's client-side cooldown/i);
    expect(SITE.description.length).toBeLessThanOrEqual(160);
  });

  it("makes Magic Imports a first-class feature", () => {
    const importsFeature = FEATURES.find(
      ({ title }) => title === "Unlimited Magic Imports",
    );

    expect(importsFeature).toBeDefined();
    expect(importsFeature?.body).toMatch(/client-side cooldown/i);
    expect(importsFeature?.body).toMatch(/activates automatically/i);
  });

  it("includes imports in the study result and stats", () => {
    expect(STEPS.at(-1)?.body).toMatch(/Magic Import/i);
    expect(STATS.map(({ label }) => label).join(" ")).toMatch(/imports/i);
  });

  it("answers the Magic Import cooldown question conservatively", () => {
    const definition = FAQ.find(({ q }) => q === "What is Gizmo AI Unlimited?");
    expectPrimaryCapabilities(definition?.a ?? "");

    const cooldown = FAQ.find(
      ({ q }) => q === "Does it remove the Gizmo AI Magic Import cooldown?",
    );
    expect(cooldown).toBeDefined();
    expect(cooldown?.a).toMatch(/disables the client-side cooldown check/i);
    expect(cooldown?.a).toMatch(/server-side limits/i);
  });

  it("describes its app-wide scope without quiz-only lifecycle claims", () => {
    const faqCopy = FAQ.map(({ a }) => a).join(" ");
    expect(faqCopy).toMatch(/app\.gizmo\.ai/i);
    expect(faqCopy).not.toMatch(/only changes how the quiz page behaves/i);
    expect(faqCopy).not.toMatch(/deactivates automatically when you leave a quiz/i);
  });

  it("scopes hearts and hints to Gizmo AI quizzes", () => {
    expect(PRIMARY_CAPABILITIES[0]).toMatch(/Gizmo AI quizzes/i);
    expect(PRIMARY_CAPABILITIES[1]).toMatch(/Gizmo AI quizzes/i);

    const quizFeatures = FEATURES.filter(({ icon }) =>
      ["Heart", "Lightbulb"].includes(icon),
    );
    expect(quizFeatures).toHaveLength(2);
    for (const feature of quizFeatures) {
      expect(`${feature.title} ${feature.body}`).toMatch(/quiz/i);
    }
  });

  it("exposes the primary capabilities and import search variants", () => {
    expect(SITE.seoTitle).toMatch(/Gizmo AI/i);
    expect(SITE.seoTitle).toMatch(/hearts/i);
    expect(SITE.seoTitle).toMatch(/quiz hints/i);
    expect(SITE.seoTitle).toMatch(/Magic Imports/i);
    expect(softwareAppSchema().featureList).toEqual([...PRIMARY_CAPABILITIES]);
    expect(SEO_KEYWORDS).toEqual(
      expect.arrayContaining([
        "Gizmo AI unlimited imports",
        "Gizmo Magic Import",
        "Gizmo import cooldown",
      ]),
    );
  });

  it("keeps the machine-readable summaries aligned", () => {
    const llms = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");
    expectPrimaryCapabilities(llms);
    expectQuizScope(llms);
    expect(llms).toMatch(/client-side cooldown/i);
    expect(llms).toMatch(/server-side limits/i);

    const manifest = JSON.parse(
      readFileSync(new URL("../../public/site.webmanifest", import.meta.url), "utf8"),
    ) as { description: string };
    expectPrimaryCapabilities(manifest.description);
    expectQuizScope(manifest.description);
  });
});

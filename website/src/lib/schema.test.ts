import { describe, it, expect } from "vitest";
import { softwareAppSchema, faqSchema, organizationSchema } from "./schema";

describe("JSON-LD builders", () => {
  it("builds a SoftwareApplication with free price and name", () => {
    const s = softwareAppSchema();
    expect(s["@type"]).toBe("SoftwareApplication");
    expect(s.name).toBe("Gizmo AI Unlimited");
    expect(s.offers.price).toBe("0");
    expect(s.applicationCategory).toBe("BrowserApplication");
  });

  it("builds an FAQPage with one entity per FAQ item", () => {
    const s = faqSchema();
    expect(s["@type"]).toBe("FAQPage");
    expect(s.mainEntity.length).toBeGreaterThanOrEqual(6);
    expect(s.mainEntity[0]["@type"]).toBe("Question");
    expect(s.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });

  it("builds an Organization with the canonical url", () => {
    const s = organizationSchema();
    expect(s["@type"]).toBe("Organization");
    expect(s.url).toBe("https://gizmo.best");
  });
});

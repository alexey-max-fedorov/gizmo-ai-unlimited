import { describe, it, expect } from "vitest";
import { detectBrowser, installLink } from "./browser";

describe("installLink", () => {
  it("sends Chrome and Edge to /get and Firefox to its store shortlink", () => {
    expect(installLink("chrome")).toEqual({ href: "/get", external: false });
    expect(installLink("edge")).toEqual({ href: "/get", external: false });
    expect(installLink("firefox")).toEqual({ href: "https://firefox.gizmo.best", external: true });
  });
});

describe("detectBrowser", () => {
  it("detects Edge from a Chromium Edge UA", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 Edg/124.0";
    expect(detectBrowser(ua)).toBe("edge");
  });

  it("detects Firefox", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0";
    expect(detectBrowser(ua)).toBe("firefox");
  });

  it("detects Brave-as-Chrome (Brave UA is indistinguishable; maps to chrome)", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
    expect(detectBrowser(ua)).toBe("chrome");
  });

  it("falls back to chrome for unknown/empty UA", () => {
    expect(detectBrowser("")).toBe("chrome");
    expect(detectBrowser("Mozilla/5.0 (Unknown)")).toBe("chrome");
  });

  it("does not misclassify Edge as Chrome", () => {
    const ua = "Chrome/124.0 Safari/537.36 Edg/124.0";
    expect(detectBrowser(ua)).not.toBe("chrome");
  });
});

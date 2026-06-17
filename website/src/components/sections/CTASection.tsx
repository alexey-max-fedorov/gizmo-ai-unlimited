"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE, SHORTLINKS } from "@/lib/constants";
import { BrowserIcon } from "../ui/BrowserIcon";
import { useBrowser } from "@/lib/useBrowser";

export function CTASection() {
  const { browser, label } = useBrowser();

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] gold-glow blur-3xl pointer-events-none" aria-hidden />
      <ScrollReveal className="relative z-10 max-w-2xl mx-auto text-center">
        <h2
          className="text-4xl lg:text-5xl font-semibold text-white leading-tight"
          style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
        >
          Start studying without limits
        </h2>
        <p className="mt-5 text-lg text-[#a0a0a0]">
          Free, open source, and private. Add {SITE.name} to your browser and open any
          quiz — it just works.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={SHORTLINKS[browser]} external size="lg">
            <BrowserIcon browser={browser} size={18} /> Add to {label}
            <ChevronRight size={18} />
          </Button>
          <Button href={SHORTLINKS.firefox} external variant="outline" size="lg">
            Add to Firefox
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}

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
            {browser === "chrome" && (
              <svg focusable="false" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified by Chrome Web Store">
                <path d="M23 11.99L20.56 9.2l.34-3.69-3.61-.82L15.4 1.5 12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 11.99l2.44 2.79-.34 3.7 3.61.82 1.89 3.2 3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69 2.44-2.8zm-3.95 1.48l-.56.65.08.85.18 1.95-1.9.43-.84.19-.44.74-.99 1.68-1.78-.77-.8-.34-.79.34-1.78.77-.99-1.67-.44-.74-.84-.19-1.9-.43.18-1.96.08-.85-.56-.65L3.67 12l1.29-1.48.56-.65-.09-.86-.18-1.94 1.9-.43.84-.19.44-.74.99-1.68 1.78.77.8.34.79-.34 1.78-.77.99 1.68.44.74.84.19 1.9.43-.18 1.95-.08.85.56.65 1.29 1.47-1.28 1.48z" />
                <path d="M10.09 13.75l-2.32-2.33-1.48 1.49 3.8 3.81 7.34-7.36-1.48-1.49z" />
              </svg>
            )}
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

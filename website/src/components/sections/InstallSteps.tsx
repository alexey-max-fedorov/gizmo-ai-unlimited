"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { INSTALL } from "@/lib/constants";
import { detectBrowser, type BrowserId } from "@/lib/browser";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrowserIcon } from "@/components/ui/BrowserIcon";
import { cn } from "@/lib/utils";

export function InstallSteps() {
  const [current, setCurrent] = useState<BrowserId>("chrome");

  useEffect(() => {
    setCurrent(detectBrowser(navigator.userAgent));
  }, []);

  return (
    <section id="install" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Install in seconds"
            title="Add it to your browser and you're done"
            subtitle="No configuration, no account, no settings panel. Install, open a Gizmo quiz, and study."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSTALL.map((target, i) => {
            const recommended = target.browser === current;
            return (
              <ScrollReveal key={target.browser} delay={i * 0.08}>
                <motion.a
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group relative flex flex-col h-full rounded-xl p-8 border transition-colors",
                    recommended
                      ? "border-[#c9a84c]/50 bg-[rgba(201,168,76,0.06)]"
                      : "border-[#1a1a1a] bg-[#111111] hover:border-[rgba(201,168,76,0.35)]",
                  )}
                >
                  {recommended && (
                    <span className="absolute top-4 right-4 text-[10px] tracking-[0.18em] uppercase text-[#c9a84c]">
                      Your browser
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-lg bg-[rgba(201,168,76,0.1)] flex items-center justify-center mb-6 text-[#c9a84c]">
                    <BrowserIcon browser={target.browser} size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-1.5">
                    {target.label}
                    <ArrowUpRight
                      size={16}
                      className="text-[#c9a84c] opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    />
                  </h3>
                  <p className="mt-3 text-sm text-[#a0a0a0] leading-relaxed">{target.note}</p>
                </motion.a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

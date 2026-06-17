"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { BrowserIcon } from "@/components/ui/BrowserIcon";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { QuizMock } from "@/components/sections/QuizMock";
import { SITE, SHORTLINKS } from "@/lib/constants";
import { useBrowser } from "@/lib/useBrowser";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const { browser, label } = useBrowser();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      {/* background treatments */}
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] gold-glow blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        <div>
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/40 bg-[rgba(201,168,76,0.07)] px-4 py-1.5 text-xs text-[#c9a84c] mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c9a84c]" />
            </span>
            Free &amp; open source · v{SITE.version}
          </motion.div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.05]"
            style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
          >
            <AnimatedText text="Study without limits" />
            <span className="block text-[#c9a84c]">
              <AnimatedText text="on Gizmo AI" delay={0.24} />
            </span>
          </h1>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="mt-6 text-lg text-[#a0a0a0] leading-relaxed max-w-xl"
          >
            {SITE.oneLiner} Add it to your browser and the out-of-hearts modal is
            gone — every hint unlocked, no account, nothing tracked.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.62 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
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
            <Button href={SHORTLINKS.github} external variant="outline" size="lg">
              <GithubIcon size={18} /> View source
            </Button>
          </motion.div>

          <p className="mt-4 text-xs text-[#666666]">
            Works on Chrome, Edge, Brave &amp; Firefox · No sign-up
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <QuizMock />
        </div>
      </div>
    </section>
  );
}

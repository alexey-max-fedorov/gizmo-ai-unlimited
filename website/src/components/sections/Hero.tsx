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
              <BrowserIcon browser={browser} size={18} /> Add to {label} — free
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

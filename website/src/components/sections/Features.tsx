"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Lightbulb,
  ShieldCheck,
  Zap,
  RefreshCw,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { FEATURES, type IconName } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const ICONS: Partial<Record<IconName, LucideIcon>> = {
  Heart,
  Lightbulb,
  ShieldCheck,
  Zap,
  RefreshCw,
  Lock,
};

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Why install it"
            title="Everything you need to study uninterrupted"
            subtitle="One free extension removes every paywall friction on Gizmo AI quizzes — and respects your privacy completely."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Heart;
            return (
              <ScrollReveal key={f.title} delay={(i % 3) * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 transition-colors hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_0_40px_rgba(201,168,76,0.08)]"
                >
                  <div className="w-12 h-12 rounded-lg bg-[rgba(201,168,76,0.1)] flex items-center justify-center mb-6">
                    <Icon size={22} className="text-[#c9a84c]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm text-[#a0a0a0] leading-relaxed">{f.body}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

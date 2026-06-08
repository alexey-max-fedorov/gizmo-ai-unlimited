"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ as ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        </ScrollReveal>

        <div className="mt-12 divide-y divide-[#1a1a1a] border-t border-b border-[#1a1a1a]">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} answer: ${item.q}`}
                >
                  <span className="text-base font-medium text-white">{item.q}</span>
                  <span className="text-[#c9a84c] shrink-0">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-[#a0a0a0] leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

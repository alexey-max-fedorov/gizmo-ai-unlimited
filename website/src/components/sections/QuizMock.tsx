"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Lightbulb, Check } from "lucide-react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/** Stylized "infinite hearts" quiz card — the product value, shown not told. */
export function QuizMock() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full max-w-md">
      {/* gold glow behind the card */}
      <div className="absolute -inset-6 gold-glow blur-3xl pointer-events-none" aria-hidden />

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        className="relative bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* top bar: hearts + status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5" aria-label="Hearts remaining: unlimited">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={reduce ? {} : { scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              >
                <Heart size={16} className="text-[#c9a84c]" fill="#c9a84c" />
              </motion.span>
            ))}
            <span className="ml-1.5 text-[#c9a84c] text-sm font-semibold">∞</span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#666666]">Question 12</span>
        </div>

        {/* prompt */}
        <p className="text-white text-base font-medium leading-snug">
          Which data structure offers average O(1) lookups by key?
        </p>

        {/* options */}
        <div className="mt-5 space-y-2.5">
          {["Hash map", "Linked list", "Binary tree", "Stack"].map((opt, i) => (
            <div
              key={opt}
              className={
                i === 0
                  ? "flex items-center justify-between rounded-lg border border-[#c9a84c]/50 bg-[rgba(201,168,76,0.08)] px-4 py-3 text-sm text-white"
                  : "flex items-center rounded-lg border border-[#1a1a1a] px-4 py-3 text-sm text-[#a0a0a0]"
              }
            >
              <span>{opt}</span>
              {i === 0 && <Check size={16} className="text-[#c9a84c]" />}
            </div>
          ))}
        </div>

        {/* unlocked hint pill */}
        <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
          <Lightbulb size={16} className="text-[#c9a84c]" />
          <span className="text-xs text-[#a0a0a0]">
            Hint unlocked — <span className="text-white">keys map directly to buckets.</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart, Lightbulb, Check, X, ArrowRight, Lock } from "lucide-react";
import { QUIZ_QUESTIONS, pickQuestionIndex } from "@/lib/quiz";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/** Stylized interactive quiz card — shows the value prop in action. */
export function QuizMock() {
  const reduce = useReducedMotion();

  // SSR-safe: start at index 0, pick random after mount
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hintRevealed, setHintRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQuestionIndex(pickQuestionIndex(QUIZ_QUESTIONS.length, Math.random()));
  }, []);

  const question = QUIZ_QUESTIONS[questionIndex];
  const answered = selected !== null;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelected(optionIndex);
      setHintRevealed(true);
    },
    [answered]
  );

  const handleNext = useCallback(() => {
    // Pick a different question when possible
    let nextIndex: number;
    if (QUIZ_QUESTIONS.length <= 1) {
      nextIndex = 0;
    } else {
      do {
        nextIndex = pickQuestionIndex(QUIZ_QUESTIONS.length, Math.random());
      } while (nextIndex === questionIndex);
    }
    setQuestionIndex(nextIndex);
    setSelected(null);
    setHintRevealed(false);
  }, [questionIndex]);

  const getOptionStyle = (i: number): string => {
    const base =
      "flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors";
    if (!answered) {
      return `${base} border-[#1a1a1a] text-[#a0a0a0] hover:border-[#333] hover:text-white cursor-pointer`;
    }
    if (i === question.correct) {
      return `${base} border-[#c9a84c]/60 bg-[rgba(201,168,76,0.1)] text-white cursor-default`;
    }
    if (i === selected) {
      return `${base} border-red-500/50 bg-red-500/10 text-white cursor-default`;
    }
    return `${base} border-[#1a1a1a] text-[#666] cursor-default`;
  };

  const getOptionAriaLabel = (i: number, text: string): string => {
    if (!answered) return text;
    if (i === question.correct && i === selected) return `${text} — correct`;
    if (i === question.correct) return `${text} — correct answer`;
    if (i === selected) return `${text} — incorrect`;
    return text;
  };

  return (
    <div className="relative w-full max-w-md">
      {/* gold glow behind the card */}
      <div
        className="absolute -inset-6 gold-glow blur-3xl pointer-events-none"
        aria-hidden
      />

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        className="relative bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* top bar: hearts + topic tag */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="flex items-center gap-1.5"
            aria-label="Hearts remaining: unlimited"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={reduce ? {} : { scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              >
                <Heart size={16} className="text-[#c9a84c]" fill="#c9a84c" />
              </motion.span>
            ))}
            <span className="ml-1.5 text-[#c9a84c] text-sm font-semibold">
              ∞
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#666666]">
            {question.topic}
          </span>
        </div>

        {/* question + options — keyed so AnimatePresence crossfades on change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {/* prompt */}
            <p className="text-white text-base font-medium leading-snug">
              {question.question}
            </p>

            {/* options */}
            <div className="mt-5 space-y-2.5" role="group" aria-label="Answer options">
              {question.options.map((opt, i) => (
                <motion.button
                  key={opt}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelect(i)}
                  aria-label={getOptionAriaLabel(i, opt)}
                  aria-pressed={answered ? i === selected : undefined}
                  whileTap={reduce || answered ? {} : { scale: 0.97 }}
                  transition={{ duration: 0.1, ease: EASE }}
                  className={`w-full text-left ${getOptionStyle(i)}`}
                >
                  <span>{opt}</span>
                  <AnimatePresence>
                    {answered && i === question.correct && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.22, ease: EASE }}
                      >
                        <Check size={16} className="text-[#c9a84c]" />
                      </motion.span>
                    )}
                    {answered && i === selected && i !== question.correct && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.22, ease: EASE }}
                      >
                        <X size={16} className="text-red-400" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* hint pill */}
            <div className="mt-5 relative">
              <div className="flex items-start gap-2 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3">
                <Lightbulb
                  size={16}
                  className="text-[#c9a84c] mt-0.5 shrink-0"
                />
                <span
                  className="text-xs text-[#a0a0a0]"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {hintRevealed ? (
                    <>
                      Hint unlocked —{" "}
                      <span className="text-white">{question.hint}</span>
                    </>
                  ) : (
                    <span className="text-[#666]">
                      Answer to reveal your hint
                    </span>
                  )}
                </span>
              </div>

              {/* locked overlay — lifts away when hint is revealed */}
              <AnimatePresence>
                {!hintRevealed && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, filter: "blur(4px)" }
                    }
                    transition={{ duration: 0.35, ease: EASE }}
                    className="absolute inset-0 flex items-center gap-2 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3 cursor-default select-none"
                    aria-hidden
                  >
                    <Lock size={14} className="text-[#666] shrink-0" />
                    <span className="text-xs text-[#666]">Hint locked</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* next question button — appears after answering */}
            <AnimatePresence>
              {answered && mounted && (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, ease: EASE, delay: 0.15 }}
                  whileTap={reduce ? {} : { scale: 0.97 }}
                  className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#1a1a1a] px-4 py-2.5 text-xs text-[#a0a0a0] hover:border-[#333] hover:text-white transition-colors"
                  aria-label="Load next question"
                >
                  Next question
                  <ArrowRight size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

/** Reveals text word-by-word with a staggered fade+rise. Static under reduced-motion. */
export function AnimatedText({ text, className, delay = 0, style }: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  // Each word is its own inline-block so it can translateY independently.
  // A right margin (not an inner space) provides word spacing — a trailing
  // space inside an inline-block collapses, which is what merged the words.
  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          style={{ marginRight: i < words.length - 1 ? "0.25em" : undefined }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

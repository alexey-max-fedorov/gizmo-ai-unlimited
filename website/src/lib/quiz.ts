export interface QuizQuestion {
  topic: string;
  question: string;
  options: string[];
  correct: number;
  hint: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    topic: "AP Environmental Science",
    question: "Which layer of the atmosphere contains the ozone layer?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    correct: 1,
    hint: "It sits just above the weather layer — UV absorption happens here.",
  },
  {
    topic: "Economics",
    question: "What happens to demand when a good's price rises, all else equal?",
    options: [
      "Demand increases",
      "Demand is unchanged",
      "Quantity demanded falls",
      "Supply increases",
    ],
    correct: 2,
    hint: "The law of demand: price up → quantity demanded down (movement along the curve, not a shift).",
  },
  {
    topic: "Math",
    question: "What is the derivative of f(x) = x³ − 5x + 2?",
    options: ["3x² − 5", "3x² + 5", "x² − 5", "3x³ − 5"],
    correct: 0,
    hint: "Power rule: bring the exponent down, reduce it by 1. The constant 2 vanishes.",
  },
  {
    topic: "History",
    question: "Which 1215 document first limited English royal power in writing?",
    options: [
      "The Bill of Rights",
      "Magna Carta",
      "The Petition of Right",
      "Act of Settlement",
    ],
    correct: 1,
    hint: "Signed at Runnymede — literally 'Great Charter' in Latin. Predates the Bill of Rights by 475 years.",
  },
  {
    topic: "Biology",
    question: "During which phase of mitosis do chromosomes line up at the cell's equator?",
    options: ["Prophase", "Anaphase", "Metaphase", "Telophase"],
    correct: 2,
    hint: "Think 'M for Middle' — chromosomes align at the metaphase plate before being pulled apart.",
  },
];

/**
 * Returns the index of a random question. Pure (caller supplies the random source)
 * for testability.
 */
export function pickQuestionIndex(count: number, rand: number): number {
  const index = Math.floor(rand * count);
  return Math.max(0, Math.min(count - 1, index));
}

import { describe, it, expect } from "vitest";
import { QUIZ_QUESTIONS, pickQuestionIndex } from "./quiz";

const REQUIRED_TOPICS = new Set([
  "AP Environmental Science",
  "Economics",
  "Math",
  "History",
  "Biology",
]);

describe("QUIZ_QUESTIONS", () => {
  it("contains exactly 5 questions", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(5);
  });

  it("every question has exactly 4 options and a valid correct index", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThanOrEqual(3);
    }
  });

  it("every question has a non-empty topic, question text, and hint", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.topic.trim().length).toBeGreaterThan(0);
      expect(q.question.trim().length).toBeGreaterThan(0);
      expect(q.hint.trim().length).toBeGreaterThan(0);
    }
  });

  it("every option in every question is non-empty", () => {
    for (const q of QUIZ_QUESTIONS) {
      for (const opt of q.options) {
        expect(opt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("covers exactly the required 5 topics", () => {
    const topics = new Set(QUIZ_QUESTIONS.map((q) => q.topic));
    expect(topics).toEqual(REQUIRED_TOPICS);
  });
});

describe("pickQuestionIndex", () => {
  it("returns 0 when rand is 0", () => {
    expect(pickQuestionIndex(5, 0)).toBe(0);
  });

  it("returns count-1 when rand is close to 1", () => {
    expect(pickQuestionIndex(5, 0.999)).toBe(4);
    expect(pickQuestionIndex(5, 0.9999)).toBe(4);
  });

  it("always stays in range [0, count-1]", () => {
    const count = 5;
    for (let i = 0; i <= 100; i++) {
      const rand = i / 100;
      const idx = pickQuestionIndex(count, rand);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThanOrEqual(count - 1);
    }
  });

  it("clamps to 0 if rand is negative (defensive)", () => {
    expect(pickQuestionIndex(5, -0.5)).toBe(0);
  });

  it("clamps to count-1 if rand >= 1 (defensive)", () => {
    expect(pickQuestionIndex(5, 1)).toBe(4);
  });

  it("works with a count of 1", () => {
    expect(pickQuestionIndex(1, 0)).toBe(0);
    expect(pickQuestionIndex(1, 0.999)).toBe(0);
  });
});

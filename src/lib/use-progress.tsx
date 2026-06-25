"use client";

import { createContext, useCallback, useContext, useMemo, ReactNode } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";

export type ProgressState = {
  /** Какие модули (1..10) пользователь отметил как пройденные */
  completed: Record<number, boolean>;
  /** Текстовые ответы из модуля 9 */
  explanations: Record<string, string>;
  /** Лучший счёт в мини-играх (модуль 1, 8) */
  scores: Record<string, number>;
};

const DEFAULT: ProgressState = {
  completed: {},
  explanations: {},
  scores: {},
};

type ProgressContextValue = {
  state: ProgressState;
  hydrated: boolean;
  toggleCompleted: (moduleId: number) => void;
  isCompleted: (moduleId: number) => boolean;
  setExplanation: (key: string, value: string) => void;
  setScore: (key: string, value: number) => void;
  resetAll: () => void;
  completedCount: number;
  totalCount: number;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState, reset, hydrated] = useLocalStorage<ProgressState>(
    "ml-learning-progress-v1",
    DEFAULT
  );

  const toggleCompleted = useCallback(
    (moduleId: number) => {
      setState((prev) => ({
        ...prev,
        completed: { ...prev.completed, [moduleId]: !prev.completed[moduleId] },
      }));
    },
    [setState]
  );

  const isCompleted = useCallback(
    (moduleId: number) => Boolean(state.completed[moduleId]),
    [state.completed]
  );

  const setExplanation = useCallback(
    (key: string, value: string) => {
      setState((prev) => ({
        ...prev,
        explanations: { ...prev.explanations, [key]: value },
      }));
    },
    [setState]
  );

  const setScore = useCallback(
    (key: string, value: number) => {
      setState((prev) => ({
        ...prev,
        scores: {
          ...prev.scores,
          [key]: Math.max(prev.scores[key] ?? 0, value),
        },
      }));
    },
    [setState]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      hydrated,
      toggleCompleted,
      isCompleted,
      setExplanation,
      setScore,
      resetAll: reset,
      completedCount: Object.values(state.completed).filter(Boolean).length,
      totalCount: 10,
    }),
    [state, hydrated, toggleCompleted, isCompleted, setExplanation, setScore, reset]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

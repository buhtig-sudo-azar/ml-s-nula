"use client";

import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/lib/use-progress";
import { CheckCircle2 } from "lucide-react";

const QUESTIONS: Array<{ key: string; question: string; hint: string; minLen: number }> = [
  {
    key: "feature",
    question: "Что такое признак в машинном обучении?",
    hint: "Подсказка: это то, что мы подаём модели на вход. Можешь привести пример.",
    minLen: 20,
  },
  {
    key: "weight",
    question: "Что такое вес и зачем он нужен?",
    hint: "Подсказка: это число, которое показывает, насколько важен признак для решения.",
    minLen: 25,
  },
  {
    key: "training",
    question: "Как именно меняются веса во время обучения?",
    hint: "Подсказка: модель предсказывает, сравнивает с меткой, считает ошибку и чуть-чуть подправляет веса.",
    minLen: 30,
  },
  {
    key: "error",
    question: "Зачем вообще модели нужна ошибка?",
    hint: "Подсказка: без ошибки непонятно, в какую сторону менять веса и улучшилась ли модель.",
    minLen: 25,
  },
  {
    key: "data",
    question: "Почему плохая разметка портит обучение, даже если алгоритм хороший?",
    hint: "Подсказка: модель учится у данных. Если данные врут, модель выучит ложь.",
    minLen: 25,
  },
];

export function Module09Explain() {
  const accent = ACCENTS[9];
  const { state, setExplanation, hydrated } = useProgress();

  return (
    <ModuleShell
      id={9}
      title="Если можешь объяснить — значит понял"
      subtitle="Лучший тест на понимание — пересказать своими словами без подсказок. Ответь на 5 вопросов ниже, ответы сохранятся автоматически."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        научиться объяснять своими словами: что такое признак, вес, как веса меняются и зачем нужна ошибка.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Если ты можешь без подсказки объяснить это пятикратно — тема
          реально начала вставать на место. Не списывай с теории выше:
          закрой этот блок, напиши ответ, потом сверь.
        </p>
        <p>
          Писать <strong>своими словами</strong> полезнее, чем читать чужое
          объяснение: мозг вынужден сам выстраивать связь между понятиями.
          Это называется «активное вспоминание» (active recall) — самый
          эффективный способ закрепить новое.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница: 5 вопросов своими словами">
        <div className="space-y-5">
          {QUESTIONS.map((q, idx) => {
            const value = hydrated ? (state.explanations[q.key] ?? "") : "";
            const ok = value.trim().length >= q.minLen;
            return (
              <div key={q.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-300 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <Label className="text-sm font-semibold">{q.question}</Label>
                  {ok && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Записано
                    </Badge>
                  )}
                </div>
                <Textarea
                  value={value}
                  onChange={(e) => setExplanation(q.key, e.target.value)}
                  placeholder={q.hint}
                  rows={3}
                  className="resize-y"
                />
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>{q.hint}</span>
                  <span className={ok ? "text-emerald-700 dark:text-emerald-400 font-medium" : ""}>
                    {value.trim().length} симв.
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border bg-lime-50 border-lime-200 dark:bg-lime-950/40 dark:border-lime-800/60 p-4 mt-2">
          <div className="text-sm font-semibold text-lime-700 dark:text-lime-300 mb-1">
            Самопроверка
          </div>
          <p className="text-sm text-foreground/90">
            После того как ответишь — попробуй объяснить то же самое{" "}
            <strong>вслух воображаемому новичку</strong>. Если запнёшься на
            месте — вернись к соответствующему модулю и перечитай теорию.
            Главное не «выучить наизусть», а научиться пересказывать.
          </p>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

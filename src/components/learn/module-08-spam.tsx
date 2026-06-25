"use client";

import { useState, useMemo } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Sparkles, RotateCcw } from "lucide-react";

// Примеры писем и их фичи
type Email = {
  id: number;
  text: string;
  // фичи: [«бесплатно», «!!!», «клик», «депозит/кредит», «подпись коллеги»]
  features: number[];
  label: "spam" | "ham";
};

const EMAILS: Email[] = [
  { id: 1, text: "Бесплатно!!! Кликни и получи приз", features: [1, 1, 1, 0, 0], label: "spam" },
  { id: 2, text: "Привет, посмотри отчёт по проекту", features: [0, 0, 0, 0, 1], label: "ham" },
  { id: 3, text: "Бесплатный депозит под 50% годовых", features: [1, 0, 0, 1, 0], label: "spam" },
  { id: 4, text: "Кликни здесь, чтобы забрать выигрыш!!!", features: [0, 1, 1, 0, 0], label: "spam" },
  { id: 5, text: "Коллеги, во вторник в 11:00 встреча", features: [0, 0, 0, 0, 1], label: "ham" },
  { id: 6, text: "Кредит бесплатно за 5 минут!!!", features: [1, 1, 0, 1, 0], label: "spam" },
];

const FEATURE_NAMES = [
  "«бесплатно»",
  "«!!!»",
  "«клик»",
  "«депозит/кредит»",
  "«коллега/отчёт»",
];

export function Module08Spam() {
  const accent = ACCENTS[8];
  const [weights, setWeights] = useState<number[]>([0, 0, 0, 0, 0]);
  const [threshold, setThreshold] = useState(0.5);

  // Оптимальные веса, которые хорошо разделяют классы
  const optimalWeights = [1.0, 0.8, 0.9, 0.9, -1.0];
  const optimalThreshold = 0.5;

  const predictions = useMemo(() => {
    return EMAILS.map((e) => {
      const signal = e.features.reduce((s, f, i) => s + f * weights[i], 0);
      // сигмоида
      const prob = 1 / (1 + Math.exp(-signal));
      const verdict = prob >= threshold ? "spam" : "ham";
      const correct = verdict === e.label;
      return { ...e, signal, prob, verdict, correct };
    });
  }, [weights, threshold]);

  const accuracy = predictions.filter((p) => p.correct).length / predictions.length;

  function setWeight(i: number, v: number) {
    setWeights((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  return (
    <ModuleShell
      id={8}
      title="Письма, спам, веса — своими руками"
      subtitle="Пройдём весь цикл на бытовом примере: фильтрация спама. Покрутим веса вручную и увидим, как модель учится отделять спам от нормальных писем."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        отработать весь цикл на простом примере и почувствовать, как именно веса «решают» исход.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Фильтр спама — классический пример обучения с учителем. У нас есть
          письма с правильными метками («спам» или «не спам») и набор{" "}
          <strong>признаков</strong>: встречается ли слово «бесплатно», есть
          ли много восклицательных знаков и т. д.
        </p>
        <p>
          Модель подбирает веса: какие признаки усиливают подозрение на спам,
          а какие — наоборот, говорят, что письмо нормальное. Если итоговый
          сигнал превышает порог — помечаем как спам.
        </p>
        <p>
          В реальности признаков тысячи (каждое слово — отдельный признак), а
          здесь их всего 5, чтобы можно было покрутить всё вручную.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница: настрой фильтр спама">
        <p className="text-sm text-muted-foreground">
          Двигай слайдеры весов. Положительный вес → признак «тянет» в спам.
          Отрицательный → «тянет» в не-спам. Цель: попасть в 100% точность.
        </p>

        <div className="grid lg:grid-cols-[1fr_auto] gap-5">
          {/* Контролы весов */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-pink-700 dark:text-pink-300">
              Веса признаков
            </div>
            {FEATURE_NAMES.map((name, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <Label className="font-mono">{name}</Label>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      weights[i] > 0 && "text-pink-700 dark:text-pink-400",
                      weights[i] < 0 && "text-emerald-700 dark:text-emerald-400"
                    )}
                  >
                    {weights[i] > 0 ? "+" : ""}
                    {weights[i].toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[weights[i]]}
                  min={-2}
                  max={2}
                  step={0.1}
                  onValueChange={(v) => setWeight(i, v[0])}
                />
              </div>
            ))}

            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <Label>Порог решения</Label>
                <span className="font-mono font-semibold">{threshold.toFixed(2)}</span>
              </div>
              <Slider
                value={[threshold]}
                min={0.05}
                max={0.95}
                step={0.05}
                onValueChange={(v) => setThreshold(v[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Если вероятность спама ≥ порога → помечаем как спам.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setWeights(optimalWeights);
                  setThreshold(optimalThreshold);
                }}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Подобрать автоматически
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setWeights([0, 0, 0, 0, 0]);
                  setThreshold(0.5);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Сброс
              </Button>
            </div>
          </div>

          {/* Точность */}
          <div className="w-full lg:w-48">
            <div
              className={cn(
                "rounded-lg p-4 border-2 text-center",
                accuracy === 1
                  ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/60"
                  : accuracy >= 0.8
                  ? "bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800/60"
                  : "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800/60"
              )}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Точность
              </div>
              <div
                className={cn(
                  "text-3xl font-bold font-mono",
                  accuracy === 1
                    ? "text-emerald-700 dark:text-emerald-400"
                    : accuracy >= 0.8
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-rose-700 dark:text-rose-400"
                )}
              >
                {(accuracy * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {predictions.filter((p) => p.correct).length} / {predictions.length} верно
              </div>
            </div>
          </div>
        </div>

        {/* Таблица писем */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                <th className="p-2 text-xs font-semibold text-muted-foreground uppercase">Письмо</th>
                {FEATURE_NAMES.map((n, i) => (
                  <th key={i} className="p-2 text-xs font-mono text-center text-muted-foreground">
                    {n}
                  </th>
                ))}
                <th className="p-2 text-xs font-semibold text-muted-foreground uppercase">Сигнал</th>
                <th className="p-2 text-xs font-semibold text-muted-foreground uppercase">P(спам)</th>
                <th className="p-2 text-xs font-semibold text-muted-foreground uppercase">Вердикт</th>
                <th className="p-2 text-xs font-semibold text-muted-foreground uppercase">Метка</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.id} className={cn(p.correct ? "" : "bg-rose-50/50 dark:bg-rose-950/20")}>
                  <td className="p-2 text-xs max-w-[180px]">{p.text}</td>
                  {p.features.map((f, i) => (
                    <td key={i} className="p-2 text-center font-mono text-xs">
                      {f === 1 ? "✓" : "·"}
                    </td>
                  ))}
                  <td className="p-2 text-center font-mono text-xs">{p.signal.toFixed(2)}</td>
                  <td className="p-2 text-center font-mono text-xs">{(p.prob * 100).toFixed(0)}%</td>
                  <td className="p-2 text-center">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-semibold",
                        p.verdict === "spam"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                      )}
                    >
                      {p.verdict === "spam" ? "спам" : "не спам"}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        p.label === "spam"
                          ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60"
                          : "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60"
                      )}
                    >
                      {p.label === "spam" ? "спам" : "не спам"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {accuracy === 1 && (
          <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 rounded p-3">
            Отличная настройка! Все 6 писем классифицированы верно. Так и
            работает обучение: алгоритм сам подбирает веса, которые мы сейчас
            подкручивали вручную.
          </div>
        )}
      </SandboxBlock>
    </ModuleShell>
  );
}

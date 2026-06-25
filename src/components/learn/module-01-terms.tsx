"use client";

import { useState } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, DefCard } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useProgress } from "@/lib/use-progress";

type Category = "feature" | "weight" | "label";

type Item = {
  id: string;
  text: string;
  correct: Category;
};

const ITEMS: Item[] = [
  { id: "1", text: "Количество слов «бесплатно» в письме", correct: "feature" },
  { id: "2", text: "Коэффициент 0.8, на который умножается признак", correct: "weight" },
  { id: "3", text: "Метка «спам», проставленная человеком", correct: "label" },
  { id: "4", text: "Рост пользователя в сантиметрах", correct: "feature" },
  { id: "5", text: "Число −1.2, которое модель подобрала сама", correct: "weight" },
  { id: "6", text: "Правильный ответ: «покупка»", correct: "label" },
  { id: "7", text: "Длина письма в символах", correct: "feature" },
  { id: "8", text: "Подпись «это спам» в обучающей выборке", correct: "label" },
  { id: "9", text: "Множитель 3.5 перед признаком «возраст»", correct: "weight" },
];

const CATEGORY_INFO: Record<Category, { label: string; short: string; color: string }> = {
  feature: { label: "Признак (что подаём в модель)", short: "П", color: "teal" },
  weight: { label: "Вес (насколько важен)", short: "В", color: "amber" },
  label: { label: "Метка (правильный ответ)", short: "М", color: "rose" },
};

export function Module01Terms() {
  const accent = ACCENTS[1];
  const [answers, setAnswers] = useState<Record<string, Category | null>>({});
  const [checked, setChecked] = useState(false);
  const { setScore } = useProgress();

  const allAnswered = ITEMS.every((it) => answers[it.id]);
  const correctCount = ITEMS.filter(
    (it) => answers[it.id] === it.correct
  ).length;

  function setAnswer(itemId: string, cat: Category | null) {
    setAnswers((prev) => ({ ...prev, [itemId]: cat }));
    if (checked) setChecked(false);
  }

  function check() {
    setChecked(true);
    setScore("m1-terms", correctCount);
  }

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  return (
    <ModuleShell
      id={1}
      title="Признак, вес, метка — три кита обучения"
      subtitle="Прежде чем говорить про обучение, нужно чётко различать: что модель получает, что она настраивает и что должно получиться."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        не путать вход (признак), важность (вес) и правильный ответ (метка).
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Любая модель машинного обучения работает с тремя сущностями. Их важно
          различать с самого начала — без этого непонятно, что именно «учится».
        </p>
        <div className="grid sm:grid-cols-3 gap-3 not-prose">
          <DefCard
            accent={accent}
            term="Признак (feature)"
            definition="Что подаётся в модель на вход. Это наблюдаемое свойство объекта: число, характеристика, сигнал."
            example="длина письма, возраст пользователя, пиксель картинки"
          />
          <DefCard
            accent={accent}
            term="Вес (weight)"
            definition="Число, которое показывает, насколько признак важен для решения. Именно веса модель и подбирает во время обучения."
            example="0.8 для признака «есть слово бесплатно»"
          />
          <DefCard
            accent={accent}
            term="Метка (label)"
            definition="Правильный ответ, который знает человек. По нему модель понимает, угадала она или ошиблась."
            example="«спам» / «не спам», «покупка» / «отказ»"
          />
        </div>
        <p className="text-sm">
          Модель нельзя «научить», если у нас нет{" "}
          <strong>меток</strong> — без них непонятно, к чему стремиться. А{" "}
          <strong>признаки</strong> без <strong>весов</strong> — это просто
          сырые данные: модель не знает, на какие из них смотреть серьёзнее.
        </p>
      </TheoryBlock>

      <SandboxBlock
        accent={accent}
        title="Песочница: рассортируй 9 примеров"
      >
        <p className="text-sm text-muted-foreground">
          Для каждой фразы выбери, к какой из трёх категорий она относится.
          Затем нажми «Проверить».
        </p>

        <div className="space-y-2">
          {ITEMS.map((item) => {
            const chosen = answers[item.id];
            const isCorrect = checked && chosen === item.correct;
            const isWrong = checked && chosen !== null && chosen !== item.correct;
            return (
              <Card
                key={item.id}
                className={cn(
                  "p-3 flex flex-wrap items-center justify-between gap-3 border",
                  isCorrect && "border-emerald-300 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/40",
                  isWrong && "border-rose-300 bg-rose-50 dark:border-rose-800/60 dark:bg-rose-950/40",
                  !checked && "border-border"
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  {checked && (isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isWrong ? (
                    <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : null)}
                  <span className="text-sm">{item.text}</span>
                </div>
                <div className="flex gap-1.5">
                  {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    const active = chosen === cat;
                    return (
                      <Button
                        key={cat}
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        onClick={() => setAnswer(item.id, active ? null : cat)}
                        className={cn(
                          "h-8 px-3 text-xs min-w-[40px]",
                          active && cat === "feature" && "bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600",
                          active && cat === "weight" && "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600",
                          active && cat === "label" && "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                        )}
                      >
                        {info.short}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={check}
            disabled={!allAnswered}
            className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600"
          >
            Проверить
          </Button>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Заново
          </Button>
          {checked && (
            <span
              className={cn(
                "text-sm font-semibold",
                correctCount === ITEMS.length
                  ? "text-emerald-700 dark:text-emerald-400"
                  : correctCount >= 7
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-rose-700 dark:text-rose-400"
              )}
            >
              {correctCount} / {ITEMS.length}{" "}
              {correctCount === ITEMS.length
                ? "— отлично!"
                : correctCount >= 7
                ? "— почти, попробуй ещё раз"
                : "— посмотри теорию выше"}
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-2 text-xs">
          {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
            <div
              key={cat}
              className={cn(
                "rounded p-2 border",
                cat === "feature" && "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/40 dark:border-teal-800/60 dark:text-teal-300",
                cat === "weight" && "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300",
                cat === "label" && "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300"
              )}
            >
              <div className="font-mono font-bold">{CATEGORY_INFO[cat].short}</div>
              <div>{CATEGORY_INFO[cat].label}</div>
            </div>
          ))}
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

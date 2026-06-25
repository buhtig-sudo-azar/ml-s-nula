"use client";

import { useState, useMemo } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

// Простая bigram-модель: считаем частоты следующих слов из «обучающей» фразы
const TRAIN_TEXT = "мама мыла раму мама мыла посуду мама готовила ужин";

function buildBigrams(text: string): Map<string, Map<string, number>> {
  const words = text.split(/\s+/);
  const map = new Map<string, Map<string, number>>();
  for (let i = 0; i < words.length - 1; i++) {
    const cur = words[i];
    const next = words[i + 1];
    if (!map.has(cur)) map.set(cur, new Map());
    const inner = map.get(cur)!;
    inner.set(next, (inner.get(next) ?? 0) + 1);
  }
  return map;
}

const BIGRAMS = buildBigrams(TRAIN_TEXT);

const TEST_SENTENCES: Array<{ text: string; cutoff: number; question: string }> = [
  {
    text: "мама мыла раму",
    cutoff: 2,
    question: "Что модель видит, когда предсказывает 3-е слово?",
  },
  {
    text: "мама готовила",
    cutoff: 2,
    question: "Модель угадывает 3-е слово. Что она знает?",
  },
  {
    text: "мама мыла посуду",
    cutoff: 1,
    question: "Что модель знает при предсказании 2-го слова?",
  },
];

export function Module06Future() {
  const accent = ACCENTS[6];
  const [revealIdx, setRevealIdx] = useState<number | null>(null);
  const [customWord, setCustomWord] = useState("мама");

  const nextWords = useMemo(() => {
    const w = customWord.trim().toLowerCase();
    const inner = BIGRAMS.get(w);
    if (!inner) return [];
    const total = Array.from(inner.values()).reduce((a, b) => a + b, 0);
    return Array.from(inner.entries())
      .map(([word, count]) => ({ word, count, prob: count / total }))
      .sort((a, b) => b.count - a.count);
  }, [customWord]);

  function nextWordsFor(word: string) {
    const inner = BIGRAMS.get(word.toLowerCase());
    if (!inner) return [];
    const total = Array.from(inner.values()).reduce((a, b) => a + b, 0);
    return Array.from(inner.entries())
      .map(([w, count]) => ({ word: w, count, prob: count / total }))
      .sort((a, b) => b.count - a.count);
  }

  return (
    <ModuleShell
      id={6}
      title="Модель угадывает следующий шаг, а не «понимает»"
      subtitle="Языковая модель не читает предложение целиком. Она видит только то, что уже было, и угадывает следующее слово по статистике."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        убрать ложное представление, что модель «понимает как человек». Она угадывает следующий шаг по уже данному контексту.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Когда ты читаешь «мама мыла...», ты уже догадываешься, что дальше
          будет «раму». Но ты <strong>не знаешь</strong> это наверняка — может
          быть «посуду», «пол», «руки». То же самое делает языковая модель:
          она смотрит на <strong>уже сказанные слова</strong> и предсказывает
          <strong> самое вероятное следующее</strong>.
        </p>
        <p>
          Важный момент: модель физически{" "}
          <strong>не видит концовку предложения</strong>. Будущего для неё
          не существует. Каждое слово она угадывает «вслепую», опираясь
          только на прошлое. Поэтому модели ошибаются, галлюцинируют и
          выдают правдоподобный бред — это не «глюк», а следствие самой
          идеи.
        </p>
        <p>
          В этой песочнице мы построим простейшую модель: она запомнит, какие
          слова обычно идут после других слов (bigram), и будет угадывать
          следующее по частоте.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница 1: что видит модель">
        <p className="text-sm text-muted-foreground">
          Обучающая фраза: <code className="bg-fuchsia-50 dark:bg-fuchsia-950/40 px-1 rounded">«{TRAIN_TEXT}»</code>.
          Наведи курсор и открой «замочек» у каждого предложения, чтобы
          увидеть, что видит модель, а что — нет.
        </p>

        <div className="space-y-2">
          {TEST_SENTENCES.map((s, idx) => {
            const words = s.text.split(" ");
            return (
              <div key={idx} className="bg-card border rounded p-3">
                <div className="text-xs text-muted-foreground mb-2">
                  {s.question}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {words.map((w, i) => {
                    const revealed = revealIdx === idx;
                    const visible = i < s.cutoff;
                    const isHidden = !visible && !revealed;
                    return (
                      <span
                        key={i}
                        className={cn(
                          "px-2.5 py-1 rounded text-sm font-medium border",
                          visible
                            ? "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:border-fuchsia-700 dark:text-fuchsia-200"
                            : isHidden
                            ? "bg-muted border-muted text-transparent select-none"
                            : "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200"
                        )}
                      >
                        {isHidden ? "████" : w}
                      </span>
                    );
                  })}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setRevealIdx(revealIdx === idx ? null : idx)}
                  >
                    {revealIdx === idx ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1" /> Скрыть
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1" /> Показать будущее
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-xs mt-2 text-muted-foreground">
                  <span className="text-fuchsia-700 dark:text-fuchsia-300 font-semibold">Розовое</span> —
                  то, что модель реально видит при предсказании.{" "}
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Зелёное</span> —
                  будущее, которое от неё скрыто.
                </div>
              </div>
            );
          })}
        </div>
      </SandboxBlock>

      <SandboxBlock accent={accent} title="Песочница 2: угадай следующее слово">
        <p className="text-sm text-muted-foreground">
          Введи слово из обучающей фразы (например, «мама» или «мыла») —
          модель покажет вероятности следующих слов, которые она «выучила».
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            className="flex-1 min-w-[180px] h-10 px-3 rounded-md border border-input bg-background text-sm"
            placeholder="Введи слово…"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setCustomWord("мама")}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            «мама»
          </Button>
        </div>

        <div className="bg-card border rounded p-4">
          <div className="text-xs uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300 mb-2">
            Что модель предсказывает после «{customWord}»
          </div>
          {nextWords.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">
              Модель такое слово не видела в обучении — она не знает, что
              предложить. Это нормально: модель не может предсказывать то,
              чего не было в данных.
            </div>
          ) : (
            <div className="space-y-2">
              {nextWords.map(({ word, count, prob }) => (
                <div key={word} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium">«{word}»</div>
                  <div className="flex-1 h-6 bg-muted rounded overflow-hidden relative">
                    <div
                      className="h-full bg-fuchsia-500 flex items-center justify-end pr-2"
                      style={{ width: `${prob * 100}%` }}
                    >
                      <span className="text-xs text-white font-mono">
                        {count}×
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-mono font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                    {(prob * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-800/60 dark:bg-fuchsia-950/40 p-3 text-sm">
          <strong className="text-fuchsia-700 dark:text-fuchsia-300">Вывод:</strong> модель не
          «думает». Она вспоминает: «в обучении после этого слова обычно шло
          вот это». Чем больше данных она видела, тем точнее её догадка — но
          она всегда остаётся догадкой, потому что будущее скрыто.
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

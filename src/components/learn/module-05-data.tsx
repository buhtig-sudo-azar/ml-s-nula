"use client";

import { useState, useEffect, useRef } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";

type DatasetKey = "clean" | "noisy" | "few" | "wrong";

const DATASETS: Record<
  DatasetKey,
  { label: string; description: string; points: Array<[number, number]> }
> = {
  clean: {
    label: "Чистые данные",
    description: "15 точек, аккуратно размеченных вдоль y = 2x",
    points: Array.from({ length: 15 }, (_, i) => {
      const x = (i + 1) * 0.4;
      return [x, 2 * x] as [number, number];
    }),
  },
  noisy: {
    label: "Шумные данные",
    description: "15 точек, но с большим разбросом вокруг правильной линии",
    points: Array.from({ length: 15 }, (_, i) => {
      const x = (i + 1) * 0.4;
      // Воспроизводимый псевдо-шум
      const noise = (Math.sin(i * 17.3) * 0.5 + Math.cos(i * 9.7) * 0.5) * 2;
      return [x, 2 * x + noise] as [number, number];
    }),
  },
  few: {
    label: "Мало примеров",
    description: "Всего 3 точки — модель может увидеть «неправильную» закономерность",
    points: [
      [1, 2.2],
      [3, 6.1],
      [5, 9.9],
    ],
  },
  wrong: {
    label: "Плохая разметка",
    description: "15 точек, но 4 из них с перепутанной меткой",
    points: Array.from({ length: 15 }, (_, i) => {
      const x = (i + 1) * 0.4;
      const correct = 2 * x;
      // Намеренно испорченные метки
      if (i === 3 || i === 7 || i === 11 || i === 13) {
        return [x, correct + 4] as [number, number];
      }
      return [x, correct] as [number, number];
    }),
  },
};

const SVG_W = 320;
const SVG_H = 220;
const PAD = 26;
const X_MAX = 6.5;
const Y_MAX = 14;

function xToSvg(x: number) {
  return PAD + (x / X_MAX) * (SVG_W - 2 * PAD);
}
function yToSvg(y: number) {
  const clamped = Math.max(0, Math.min(Y_MAX, y));
  return SVG_H - PAD - (clamped / Y_MAX) * (SVG_H - 2 * PAD);
}

export function Module05Data() {
  const accent = ACCENTS[5];
  const [datasetKey, setDatasetKey] = useState<DatasetKey>("clean");
  const [weight, setWeight] = useState(0.3);
  const [epoch, setEpoch] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const learningRate = 0.02;

  const points = DATASETS[datasetKey].points;

  function trainStep() {
    setWeight((w) => {
      const grad = (-2 / points.length) * points.reduce(
        (s, [x, y]) => s + x * (y - w * x),
        0
      );
      const newW = w - learningRate * grad;
      if (!isFinite(newW) || Math.abs(newW) > 50) return w;
      return newW;
    });
    setEpoch((e) => e + 1);
  }

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(trainStep, 200);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, datasetKey]);

  function selectDataset(key: DatasetKey) {
    setAutoPlay(false);
    setDatasetKey(key);
    setWeight(0.3);
    setEpoch(0);
  }

  function reset() {
    setAutoPlay(false);
    setWeight(0.3);
    setEpoch(0);
  }

  const predictions = points.map(([x]) => weight * x);
  const errors = points.map(([x, y], i) => y - predictions[i]);
  const mse = errors.reduce((s, e) => s + e * e, 0) / errors.length;

  return (
    <ModuleShell
      id={5}
      title="Почему разметка так важна"
      subtitle="Модель не знает «истины» — она учится у данных. Хорошие данные дают хорошее обучение. Плохие метки портят результат даже при идеальном алгоритме."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        увидеть своими глазами, как одни и те же алгоритм и веса ведут себя по-разному на разных данных.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          У модели нет своего «мнения». Она впитывает то, что ей дают. Поэтому
          качество обучения почти полностью определяется качеством данных.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 not-prose">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/40 p-3">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase mb-1">
              Что помогает
            </div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Аккуратная разметка без противоречий</li>
              <li>Достаточно примеров (десятки и сотни, не 2-3)</li>
              <li>Разнообразие — разные ситуации в данных</li>
              <li>Сбалансированные классы (поровну спама и не-спама)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-800/60 dark:bg-rose-950/40 p-3">
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase mb-1">
              Что портит
            </div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Ошибки в метках (человек перепутал «спам» и «не спам»)</li>
              <li>Слишком мало примеров</li>
              <li>Шум и противоречия в данных</li>
              <li>Смещение: все примеры из одной узкой ситуации</li>
            </ul>
          </div>
        </div>
        <p className="text-sm">
          Запомни главное правило ML:{" "}
          <strong className="text-orange-700 dark:text-orange-300">«мусор на входе — мусор на выходе»</strong> (garbage in, garbage out).
          Лучшие данные часто важнее более сложной модели.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница: одни и те же веса, разные данные">
        <p className="text-sm text-muted-foreground">
          Истинная зависимость везде <code>y = 2 × x</code>. Модель стартует с
          веса 0.3. Включи автоплей на каждом датасете и сравни, к какому
          весу модель приходит и какая у неё ошибка.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {(Object.keys(DATASETS) as DatasetKey[]).map((key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={datasetKey === key ? "default" : "outline"}
              onClick={() => selectDataset(key)}
              className={cn(
                datasetKey === key && "bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-600"
              )}
            >
              {DATASETS[key].label}
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground italic mb-3">
          {DATASETS[datasetKey].description}
        </p>

        <div className="grid lg:grid-cols-[auto_1fr] gap-5">
          <div>
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full max-w-[400px] bg-card border rounded text-muted-foreground"
              role="img"
              aria-label="График обучения на выбранном датасете"
            >
              {[0, 4, 8, 12].map((y) => (
                <g key={y}>
                  <line
                    x1={PAD}
                    y1={yToSvg(y)}
                    x2={SVG_W - PAD}
                    y2={yToSvg(y)}
                    stroke="rgba(161, 161, 170, 0.4)"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD - 4}
                    y={yToSvg(y) + 3}
                    textAnchor="end"
                    fontSize={9}
                    fill="currentColor"
                  >
                    {y}
                  </text>
                </g>
              ))}

              <line
                x1={xToSvg(0)}
                y1={yToSvg(0)}
                x2={xToSvg(X_MAX)}
                y2={yToSvg(2 * X_MAX)}
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />

              <line
                x1={xToSvg(0)}
                y1={yToSvg(0)}
                x2={xToSvg(X_MAX)}
                y2={yToSvg(weight * X_MAX)}
                stroke="#ea580c"
                strokeWidth={2.5}
              />

              {points.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={xToSvg(x)}
                  cy={yToSvg(y)}
                  r={4}
                  fill="#0d9488"
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </svg>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-800/60 rounded p-3">
                <div className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300">
                  Текущий вес
                </div>
                <div className="text-2xl font-bold font-mono text-orange-800 dark:text-orange-200">
                  {weight.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">цель: 2.000</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60 rounded p-3">
                <div className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-300">
                  MSE
                </div>
                <div className="text-2xl font-bold font-mono text-rose-800 dark:text-rose-200">
                  {mse.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">эпох: {epoch}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => {
                  setAutoPlay(false);
                  trainStep();
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-600"
              >
                Шаг
              </Button>
              <Button
                type="button"
                variant={autoPlay ? "default" : "outline"}
                onClick={() => setAutoPlay((p) => !p)}
              >
                {autoPlay ? (
                  <>
                    <Pause className="h-4 w-4 mr-1.5" />
                    Пауза
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1.5" />
                    Автоплей
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Сброс
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-3 text-sm space-y-2">
              <div className="font-semibold text-orange-700 dark:text-orange-300">Что наблюдаем:</div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Чистые:</strong> вес быстро подходит к 2.0, MSE близко к 0.</li>
                <li><strong>Шумные:</strong> вес дрейфует вокруг 2, MSE остаётся заметной.</li>
                <li><strong>Мало примеров:</strong> модель «находит» закономерность, но она хрупкая.</li>
                <li><strong>Плохая разметка:</strong> вес уезжает от 2, MSE большая и не падает.</li>
              </ul>
            </div>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

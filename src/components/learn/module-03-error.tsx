"use client";

import { useState, useMemo } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

// 5 точек: (x, y) — изучаем зависимость y от x
const POINTS: Array<[number, number]> = [
  [1, 2.1],
  [2, 3.9],
  [3, 6.2],
  [4, 7.8],
  [5, 10.1],
];

const SVG_W = 320;
const SVG_H = 240;
const PAD = 28;
const X_MIN = 0;
const X_MAX = 6;
const Y_MIN = 0;
const Y_MAX = 12;

function xToSvg(x: number) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PAD);
}
function yToSvg(y: number) {
  return SVG_H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SVG_H - 2 * PAD);
}

export function Module03Error() {
  const accent = ACCENTS[3];
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);

  // Оптимальные: примерно slope=2, intercept=0
  const optimalSlope = 2;
  const optimalIntercept = 0;

  // Считаем предсказания и ошибку (MSE)
  const { predictions, errors, mse, totalError } = useMemo(() => {
    const preds = POINTS.map(([x]) => slope * x + intercept);
    const errs = POINTS.map(([_, y], i) => y - preds[i]);
    const mseVal = errs.reduce((s, e) => s + e * e, 0) / errs.length;
    const total = errs.reduce((s, e) => s + Math.abs(e), 0);
    return { predictions: preds, errors: errs, mse: mseVal, totalError: total };
  }, [slope, intercept]);

  const isClose = mse < 0.5;

  return (
    <ModuleShell
      id={3}
      title="Зачем модели вообще менять веса"
      subtitle="После предсказания модель сравнивает свой ответ с правильной меткой. Разница — это ошибка. Чем меньше ошибка, тем лучше модель."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        понять, зачем модели вообще менять веса — потому что есть ошибка, и её хочется уменьшить.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Ошибка — это расстояние между тем, что предсказала модель, и тем, что
          было на самом деле. Если модель предсказала{" "}
          <code className="bg-rose-50 dark:bg-rose-950/40 px-1 rounded">3</code>, а правильный
          ответ <code className="bg-rose-50 dark:bg-rose-950/40 px-1 rounded">5</code> — ошибка
          равна <code className="bg-rose-50 dark:bg-rose-950/40 px-1 rounded">2</code>.
        </p>
        <p>
          Один пример ничего не говорит. Поэтому ошибку считают сразу по
          всем примерам и усредняют. Самый простой способ —{" "}
          <strong>MSE (Mean Squared Error)</strong>: возводим каждую ошибку в
          квадрат (чтобы убрать знак и наказать большие ошибки сильнее) и
          берём среднее.
        </p>
        <pre className="bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60 rounded p-3 text-xs overflow-x-auto not-prose">
{`MSE = среднее( (правильный_ответ − предсказание)² )`}
        </pre>
        <p>
          Именно эту цифру модель и пытается уменьшить во время обучения.
          По сути, <strong>обучение = уменьшение ошибки</strong>.
        </p>
      </TheoryBlock>

      <SandboxBlock
        accent={accent}
        title="Песочница: подгони прямую под точки"
      >
        <p className="text-sm text-muted-foreground">
          Дано 5 точек. Модель — это прямая <code>y = slope × x + intercept</code>.
          Двигай слайдеры и смотри, как меняется ошибка. Цель — сделать MSE
          как можно меньше.
        </p>

        <div className="grid lg:grid-cols-[auto_1fr] gap-5">
          {/* График */}
          <div className="space-y-2">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full max-w-[400px] bg-card border rounded text-muted-foreground"
              role="img"
              aria-label="График точек и прямой модели"
            >
              {/* Сетка */}
              {[0, 3, 6, 9, 12].map((y) => (
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
                    x={PAD - 6}
                    y={yToSvg(y) + 3}
                    textAnchor="end"
                    fontSize={9}
                    fill="currentColor"
                  >
                    {y}
                  </text>
                </g>
              ))}
              {[0, 1, 2, 3, 4, 5, 6].map((x) => (
                <text
                  key={x}
                  x={xToSvg(x)}
                  y={SVG_H - PAD + 12}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                >
                  {x}
                </text>
              ))}

              {/* Прямая модели */}
              <line
                x1={xToSvg(X_MIN)}
                y1={yToSvg(slope * X_MIN + intercept)}
                x2={xToSvg(X_MAX)}
                y2={yToSvg(slope * X_MAX + intercept)}
                stroke="#0d9488"
                strokeWidth={2.5}
              />

              {/* Линии ошибок */}
              {POINTS.map(([x, y], i) => {
                const px = xToSvg(x);
                const py = yToSvg(y);
                const pyPred = yToSvg(predictions[i]);
                return (
                  <line
                    key={i}
                    x1={px}
                    y1={py}
                    x2={px}
                    y2={pyPred}
                    stroke="#e11d48"
                    strokeWidth={1.5}
                    strokeDasharray="3 2"
                    opacity={0.7}
                  />
                );
              })}

              {/* Точки */}
              {POINTS.map(([x, y], i) => (
                <g key={i}>
                  <circle
                    cx={xToSvg(x)}
                    cy={yToSvg(y)}
                    r={5}
                    fill="#0d9488"
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  {/* Предсказание — пустой кружок */}
                  <circle
                    cx={xToSvg(x)}
                    cy={yToSvg(predictions[i])}
                    r={3.5}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth={1.5}
                  />
                </g>
              ))}
            </svg>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-teal-600 dark:bg-teal-500" />
                <span>Точка данных</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full border-2 border-rose-600 dark:border-rose-500" />
                <span>Предсказание модели</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-px border-t-2 border-dashed border-rose-600 dark:border-rose-500" />
                <span>Ошибка</span>
              </div>
            </div>
          </div>

          {/* Контролы */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>slope (наклон)</label>
                <span className="font-mono font-semibold">{slope.toFixed(2)}</span>
              </div>
              <Slider
                value={[slope]}
                min={-2}
                max={5}
                step={0.05}
                onValueChange={(v) => setSlope(v[0])}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>intercept (сдвиг)</label>
                <span className="font-mono font-semibold">{intercept.toFixed(2)}</span>
              </div>
              <Slider
                value={[intercept]}
                min={-5}
                max={5}
                step={0.05}
                onValueChange={(v) => setIntercept(v[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {POINTS.map(([x, y], i) => (
                <div
                  key={i}
                  className="bg-card border rounded px-2 py-1.5 flex justify-between"
                >
                  <span className="text-muted-foreground">
                    точка {i + 1}: y={y}
                  </span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      Math.abs(errors[i]) < 0.3
                        ? "text-emerald-700 dark:text-emerald-400"
                        : Math.abs(errors[i]) < 1
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-rose-700 dark:text-rose-400"
                    )}
                  >
                    {errors[i] > 0 ? "+" : ""}
                    {errors[i].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className={cn(
                "rounded-lg p-3 border text-center",
                isClose
                  ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/60"
                  : "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60"
              )}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                MSE (средняя квадратичная ошибка)
              </div>
              <div
                className={cn(
                  "text-2xl font-bold font-mono",
                  isClose ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                )}
              >
                {mse.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Сумма модулей ошибок: {totalError.toFixed(2)}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSlope(optimalSlope);
                setIntercept(optimalIntercept);
              }}
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              Показать оптимальную прямую
            </Button>

            {isClose && (
              <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium text-center">
                Отлично! MSE близко к нулю — модель почти не ошибается.
              </div>
            )}
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Play, Pause, StepForward, RotateCcw } from "lucide-react";

// Простая линейная регрессия: y = w * x (без intercept для наглядности)
// Истина: y = 2 * x
const TRUE_SLOPE = 2;
const POINTS: Array<[number, number]> = [
  [1, 2.0],
  [2, 4.1],
  [3, 5.9],
  [4, 8.0],
  [5, 10.1],
];

const SVG_W = 320;
const SVG_H = 220;
const PAD = 26;
const X_MAX = 6;
const Y_MAX = 12;

function xToSvg(x: number) {
  return PAD + (x / X_MAX) * (SVG_W - 2 * PAD);
}
function yToSvg(y: number) {
  return SVG_H - PAD - (Math.max(0, Math.min(Y_MAX, y)) / Y_MAX) * (SVG_H - 2 * PAD);
}

export function Module04Training() {
  const accent = ACCENTS[4];
  const [weight, setWeight] = useState(0.5);
  const [epoch, setEpoch] = useState(0);
  const [learningRate, setLearningRate] = useState(0.05);
  const [targetEpochs, setTargetEpochs] = useState(50);
  const [autoPlay, setAutoPlay] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const predictions = useMemo(
    () => POINTS.map(([x]) => weight * x),
    [weight]
  );
  const errors = useMemo(
    () => POINTS.map(([x, y], i) => y - predictions[i]),
    [predictions]
  );
  const mse = useMemo(
    () => errors.reduce((s, e) => s + e * e, 0) / errors.length,
    [errors]
  );

  // Один шаг градиентного спуска: dMSE/dw = -2/N * sum(x * (y - wx)) = -2/N * sum(x * error)
  function trainStep() {
    setWeight((w) => {
      const grad = (-2 / POINTS.length) * POINTS.reduce(
        (s, [x, y]) => s + x * (y - w * x),
        0
      );
      const newW = w - learningRate * grad;
      return newW;
    });
    setEpoch((e) => e + 1);
    setHistory((h) => [...h, mse]);
  }

  // Автоплей сам останавливается, когда достигнуто целевое количество эпох.
  useEffect(() => {
    if (autoPlay && epoch >= targetEpochs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- легитимная остановка автоплея при достижении цели
      setAutoPlay(false);
      return;
    }
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        trainStep();
      }, 350);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, learningRate, epoch, targetEpochs]);

  function reset() {
    setAutoPlay(false);
    setWeight(0.5);
    setEpoch(0);
    setHistory([]);
  }

  const converged = mse < 0.05;
  const diverged = !isFinite(weight) || Math.abs(weight) > 100;
  const targetReached = epoch >= targetEpochs;

  return (
    <ModuleShell
      id={4}
      title="Обучение как подстройка чисел, а не магия"
      subtitle="Сначала веса случайные. Потом модель делает предсказание, считает ошибку и чуть-чуть двигает вес в правильную сторону. И так много раз."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        понять обучение как подстройку чисел — никаких волшебных заклинаний, просто цикл «предскажи → ошибись → подправь».
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Представь, что ты вслепую крутишь ручку радио, пытаясь поймать
          волну. Сделал шаг — послушал — стало лучше или хуже? Если лучше,
          крутим в ту же сторону, если хуже — в обратную. Примерно так
          учится модель:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Веса случайные (например, 0.5).</li>
          <li>Модель делает предсказание по всем примерам.</li>
          <li>Считает ошибку (MSE).</li>
          <li>Считает, в какую сторону и насколько нужно поменять каждый вес.</li>
          <li>Меняет вес на чуть-чуть.</li>
          <li>Возвращается к шагу 2.</li>
        </ol>
        <p>
          Шаг 4 — это и есть{" "}
          <strong>градиентный спуск</strong> (о нём — в модуле 10). Здесь
          важно только одно: <strong>модель не «понимает» задачу, она просто
          двигает числа в сторону уменьшения ошибки</strong>. Чем больше
          циклов (эпох), тем ближе вес к правильному значению.
        </p>
        <p>
          Величина шага называется{" "}
          <strong>learning rate (скорость обучения)</strong>. Слишком
          маленький — модель учится годами. Слишком большой — прыгает мимо
          правильного ответа и может вообще разойтись.
        </p>

        <h3 className="text-base font-semibold mt-4 mb-2">Словарь терминов</h3>
        <p className="text-sm mb-3">
          Эти слова будут встречаться во всех материалах по ML — поэтому
          имеет смысл разобраться с ними сразу, без формул и без воды.
        </p>
        <dl className="text-sm space-y-3">
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Эпоха (epoch)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Один полный проход модели по всей обучающей выборке. В этой
              песочнице пять точек, и каждая «эпоха» — это обновление веса
              по всем пяти точкам сразу (усреднённый градиент). В реальных
              задачах эпоха может состоять из тысяч примеров. Параметр
              «Количество эпох» как раз и задаёт, сколько таких полных
              проходов нужно сделать: 50, 100, 200 — обычно подбирается
              пользователем или автоматически по поведению ошибки.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Итерация (iteration / step)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Одно обновление весов. В нашей песочнице одна итерация равна
              одной эпохе, потому что вес обновляется один раз за проход.
              В настоящих моделях с батчами одна эпоха состоит из множества
              итераций: например, 1000 примеров и батч 100 → 10 итераций
              в одной эпохе.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Батч (batch / mini-batch)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Порция примеров, по которым считается один шаг. Батч равен
              всей выборке → это «batch gradient descent» (как у нас).
              Батч равен одному примеру → «stochastic gradient descent».
              Что-то посередине (32, 64, 128) → «mini-batch», самый
              частый вариант в реальных проектах.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Градиент (gradient)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Вектор, который показывает направление и крутизну роста
              ошибки. Если идти в обратную сторону — ошибка будет
              уменьшаться. Чем больше градиент, тем сильнее «тянет» вес в
              эту сторону. В песочнице он считается автоматически по
              формуле производной MSE.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Learning rate (α, скорость обучения)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Множитель, который решает, насколько сильно каждый шаг
              сдвигает вес. Маленький LR → модель ползёт медленно, но
              стабильно. Большой → скачет быстро, но может перепрыгнуть
              правильный ответ и раскачаться вплоть до бесконечности.
              Типичные значения: 0.001–0.1.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              MSE (Mean Squared Error)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Среднеквадратичная ошибка. Берём разницу между предсказанием
              и правильным ответом на каждом примере, возводим в квадрат
              (чтобы убрать минусы и наказывать большие ошибки сильнее),
              усредняем. Чем меньше MSE — тем лучше модель.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Сходимость (convergence)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Ситуация, когда ошибка перестаёт уменьшаться и вес
              стабилизируется около одного значения. В песочнице это
              момент, когда MSE падает ниже 0.05 — тогда появляется
              зелёное уведомление «Модель сошлась».
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-800 dark:text-violet-300">
              Расходимость (divergence)
            </dt>
            <dd className="ml-4 text-muted-foreground">
              Обратный сценарий: ошибка растёт, вес улетает в бесконечность
              или NaN. Обычно причина — слишком большой learning rate.
              Лечится уменьшением LR и сбросом обучения.
            </dd>
          </div>
        </dl>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница: понаблюдай за обучением">
        <p className="text-sm text-muted-foreground">
          Истинная зависимость: <code>y = 2 × x</code>. Вес модели стартует с
          0.5. Нажимай «Шаг» или включи автоплей и смотри, как вес подбирается
          к 2, а ошибка уменьшается.
        </p>

        <div className="grid lg:grid-cols-[auto_1fr] gap-5">
          <div className="space-y-2">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full max-w-[400px] bg-card border rounded text-muted-foreground"
              role="img"
              aria-label="График обучения"
            >
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

              {/* Истинная прямая */}
              <line
                x1={xToSvg(0)}
                y1={yToSvg(0)}
                x2={xToSvg(X_MAX)}
                y2={yToSvg(TRUE_SLOPE * X_MAX)}
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
              <text
                x={xToSvg(5.5)}
                y={yToSvg(11) - 4}
                textAnchor="end"
                fontSize={9}
                fill="currentColor"
              >
                истина y=2x
              </text>

              {/* Текущая прямая модели */}
              {!diverged && (
                <line
                  x1={xToSvg(0)}
                  y1={yToSvg(0)}
                  x2={xToSvg(X_MAX)}
                  y2={yToSvg(weight * X_MAX)}
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                />
              )}

              {/* Точки */}
              {POINTS.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={xToSvg(x)}
                  cy={yToSvg(y)}
                  r={4.5}
                  fill="#0d9488"
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </svg>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-px border-t-2 border-dashed border-muted-foreground" />
                <span>Истинная прямая</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-1 bg-violet-600 dark:bg-violet-500" />
                <span>Модель</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-violet-50 border border-violet-200 dark:bg-violet-950/40 dark:border-violet-800/60 rounded p-3">
                <div className="text-xs uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  Текущий вес
                </div>
                <div className="text-2xl font-bold font-mono text-violet-800 dark:text-violet-200">
                  {weight.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">
                  цель: 2.000
                </div>
              </div>
              <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60 rounded p-3">
                <div className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-300">
                  MSE
                </div>
                <div className="text-2xl font-bold font-mono text-rose-800 dark:text-rose-200">
                  {mse.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">
                  эпох: {epoch} / {targetEpochs}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Learning rate (скорость обучения)</Label>
                <span className="font-mono font-semibold">{learningRate.toFixed(3)}</span>
              </div>
              <Slider
                value={[learningRate]}
                min={0.005}
                max={0.3}
                step={0.005}
                onValueChange={(v) => setLearningRate(v[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Маленький → медленно, но уверенно. Большой → быстро, но может разойтись.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Количество эпох (цель)</Label>
                <span className="font-mono font-semibold">{targetEpochs}</span>
              </div>
              <Slider
                value={[targetEpochs]}
                min={5}
                max={200}
                step={5}
                onValueChange={(v) => setTargetEpochs(v[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Автоплей остановится после {targetEpochs} эпох. Можно жать «Шаг» и
                дальше — лимит действует только на автоплей.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={trainStep}
                disabled={diverged}
                className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-600"
              >
                <StepForward className="h-4 w-4 mr-1.5" />
                Шаг
              </Button>
              <Button
                type="button"
                variant={autoPlay ? "default" : "outline"}
                onClick={() => !diverged && setAutoPlay((p) => !p)}
                disabled={diverged}
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

            {converged && !targetReached && (
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 rounded p-2">
                Модель сошлась! Вес ≈ 2, ошибка почти нулевая.
              </div>
            )}
            {targetReached && !diverged && (
              <div className="text-sm text-amber-700 dark:text-amber-300 font-medium bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 rounded p-2">
                Цикл обучения завершён: пройдено {targetEpochs} эпох. Жми
                «Шаг», чтобы продолжить, или «Сброс», чтобы начать заново.
              </div>
            )}
            {diverged && (
              <div className="text-sm text-rose-700 dark:text-rose-300 font-medium bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60 rounded p-2">
                Модель разошлась — learning rate слишком большой. Сбрось и
                попробуй меньший.
              </div>
            )}

            {/* График ошибки по эпохам */}
            {history.length > 1 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-violet-700 dark:text-violet-300 mb-1">
                  MSE по эпохам
                </div>
                <div className="h-16 bg-card border rounded p-1 flex items-end gap-px overflow-hidden">
                  {history.slice(-50).map((m, i) => {
                    const maxM = Math.max(...history.slice(-50), 1);
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-rose-400 dark:bg-rose-500 rounded-t"
                        style={{
                          height: `${(m / maxM) * 100}%`,
                          minHeight: "1px",
                        }}
                        title={`Эпоха ${i + 1}: MSE=${m.toFixed(3)}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

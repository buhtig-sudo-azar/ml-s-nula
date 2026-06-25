"use client";

import { useState, useMemo } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FEATURE_NAMES = [
  "«бесплатно» в письме",
  "Восклицательные знаки",
  "Длина письма",
];

const WEIGHT_NAMES = [
  "Вес: «бесплатно»",
  "Вес: «!»",
  "Вес: длина",
];

export function Module02Weights() {
  const accent = ACCENTS[2];
  const [features, setFeatures] = useState<number[]>([1, 0, 2]);
  const [weights, setWeights] = useState<number[]>([2, 1, -1]);
  const [bias, setBias] = useState(0);
  const [useBias, setUseBias] = useState(false);

  const products = useMemo(
    () => features.map((f, i) => f * weights[i]),
    [features, weights]
  );
  const sum = useMemo(
    () => products.reduce((a, b) => a + b, 0) + (useBias ? bias : 0),
    [products, useBias, bias]
  );

  const maxAbs = 20; // для масштаба столбиков
  const sumHeight = Math.min(100, (Math.abs(sum) / maxAbs) * 100);

  return (
    <ModuleShell
      id={2}
      title="Где вообще берётся решение модели"
      subtitle="Каждый признак умножается на свой вес, произведения складываются — получается один числовой сигнал. Это и есть «решение» до порога."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        понять, откуда берётся число, на основе которого модель принимает решение.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Представь, что модель — это взвешенное голосование. Каждый признак
          что-то говорит, но у каждого есть свой{" "}
          <strong>вес</strong> (важность). Дальше работает простая арифметика:
        </p>
        <pre className="bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 rounded p-3 text-xs overflow-x-auto not-prose">
{`сигнал = (признак₁ × вес₁) + (признак₂ × вес₂) + (признак₃ × вес₃) + bias`}
        </pre>
        <p>
          Если <strong>вес положительный</strong> — признак «тянет» сигнал
          вверх (например, в сторону «спам»). Если{" "}
          <strong>отрицательный</strong> — тянет вниз. Если вес равен нулю —
          признак просто игнорируется.
        </p>
        <p>
          <strong>bias (смещение)</strong> — это стартовая точка модели. Можно
          думать про неё как про «склонность по умолчанию»: например, модель
          изначально чуть-чуть подозревает все письма в спаме, а признаки уже
          доказывают или опровергают.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница: крути слайдеры и смотри на сигнал">
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Левая колонка — слайдеры */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2">
                Признаки (вход)
              </h4>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <Label className="text-foreground/80">{FEATURE_NAMES[i]}</Label>
                      <span className="font-mono font-semibold">{f.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[f]}
                      min={-3}
                      max={3}
                      step={0.5}
                      onValueChange={(v) =>
                        setFeatures((prev) => {
                          const next = [...prev];
                          next[i] = v[0];
                          return next;
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2">
                Веса (важность)
              </h4>
              <div className="space-y-3">
                {weights.map((w, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <Label className="text-foreground/80">{WEIGHT_NAMES[i]}</Label>
                      <span
                        className={cn(
                          "font-mono font-semibold",
                          w > 0 && "text-emerald-700 dark:text-emerald-400",
                          w < 0 && "text-rose-700 dark:text-rose-400"
                        )}
                      >
                        {w > 0 ? "+" : ""}
                        {w.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[w]}
                      min={-3}
                      max={3}
                      step={0.5}
                      onValueChange={(v) =>
                        setWeights((prev) => {
                          const next = [...prev];
                          next[i] = v[0];
                          return next;
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Switch checked={useBias} onCheckedChange={setUseBias} id="bias-toggle" />
              <Label htmlFor="bias-toggle" className="text-sm">
                Добавить смещение (bias)
              </Label>
            </div>

            {useBias && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <Label>bias</Label>
                  <span className="font-mono font-semibold">{bias.toFixed(1)}</span>
                </div>
                <Slider
                  value={[bias]}
                  min={-5}
                  max={5}
                  step={0.5}
                  onValueChange={(v) => setBias(v[0])}
                />
              </div>
            )}
          </div>

          {/* Правая колонка — визуализация */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2">
                Формула
              </h4>
              <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 rounded p-3 font-mono text-xs space-y-1 overflow-x-auto">
                {products.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {features[i].toFixed(1)} × {weights[i] > 0 ? "+" : ""}
                      {weights[i].toFixed(1)} =
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        p > 0 && "text-emerald-700 dark:text-emerald-400",
                        p < 0 && "text-rose-700 dark:text-rose-400"
                      )}
                    >
                      {p > 0 ? "+" : ""}
                      {p.toFixed(2)}
                    </span>
                  </div>
                ))}
                {useBias && (
                  <div className="flex justify-between border-t border-amber-200 dark:border-amber-800/60 pt-1 mt-1">
                    <span>bias:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        bias > 0 && "text-emerald-700 dark:text-emerald-400",
                        bias < 0 && "text-rose-700 dark:text-rose-400"
                      )}
                    >
                      {bias > 0 ? "+" : ""}
                      {bias.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t-2 border-amber-300 dark:border-amber-700 pt-1 mt-1 text-sm">
                  <span className="font-bold">Сигнал =</span>
                  <span
                    className={cn(
                      "font-bold",
                      sum > 0 && "text-emerald-700 dark:text-emerald-400",
                      sum < 0 && "text-rose-700 dark:text-rose-400",
                      sum === 0 && "text-foreground"
                    )}
                  >
                    {sum > 0 ? "+" : ""}
                    {sum.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2">
                Визуализация произведений
              </h4>
              <div className="bg-card border rounded p-3 space-y-2">
                {products.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">
                      {FEATURE_NAMES[i]}
                    </span>
                    <div className="flex-1 h-5 bg-muted rounded relative overflow-hidden">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                      <div
                        className={cn(
                          "absolute top-0 bottom-0",
                          p >= 0
                            ? "bg-emerald-400 left-1/2"
                            : "bg-rose-400 right-1/2"
                        )}
                        style={{ width: `${(Math.abs(p) / maxAbs) * 50}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "font-mono text-xs w-12 text-right",
                        p > 0 && "text-emerald-700 dark:text-emerald-400",
                        p < 0 && "text-rose-700 dark:text-rose-400"
                      )}
                    >
                      {p > 0 ? "+" : ""}
                      {p.toFixed(1)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold w-32 shrink-0">
                      Итоговый сигнал
                    </span>
                    <div className="flex-1 h-7 bg-muted rounded relative overflow-hidden">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                      <div
                        className={cn(
                          "absolute top-0 bottom-0",
                          sum >= 0
                            ? "bg-emerald-500 left-1/2"
                            : "bg-rose-500 right-1/2"
                        )}
                        style={{ width: `${sumHeight / 2}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "font-mono text-sm font-bold w-12 text-right",
                        sum > 0 && "text-emerald-700 dark:text-emerald-400",
                        sum < 0 && "text-rose-700 dark:text-rose-400"
                      )}
                    >
                      {sum > 0 ? "+" : ""}
                      {sum.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "rounded-lg p-3 text-center font-semibold text-sm border",
                sum > 0
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300"
                  : sum < 0
                  ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300"
                  : "bg-muted border-border text-foreground"
              )}
            >
              {sum > 0
                ? "Сигнал положительный → модель «склоняется» в одну сторону"
                : sum < 0
                ? "Сигнал отрицательный → модель «склоняется» в другую сторону"
                : "Сигнал равен нулю → модель в неопределённости"}
            </div>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

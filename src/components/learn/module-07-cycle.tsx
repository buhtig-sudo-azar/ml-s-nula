"use client";

import { useState, useEffect, useRef } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Database,
  Boxes,
  Scale,
  Brain,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

type StageKey = "data" | "features" | "weights" | "predict" | "error" | "update";

const STAGES: Array<{
  key: StageKey;
  label: string;
  short: string;
  description: string;
  icon: typeof Database;
  color: string;
}> = [
  {
    key: "data",
    label: "Данные",
    short: "Данные",
    description: "Сырые примеры: тексты, картинки, числа. Без данных учиться не из чего.",
    icon: Database,
    color: "emerald",
  },
  {
    key: "features",
    label: "Признаки",
    short: "Признаки",
    description: "Превращаем сырые данные в числа: длина письма, наличие слова «бесплатно» и т. д.",
    icon: Boxes,
    color: "teal",
  },
  {
    key: "weights",
    label: "Веса",
    short: "Веса",
    description: "Числа, которые показывают, насколько важен каждый признак. В начале — случайные.",
    icon: Scale,
    color: "amber",
  },
  {
    key: "predict",
    label: "Предсказание",
    short: "Предсказание",
    description: "Признаки × веса, складываем — получаем число. Превращаем его в ответ модели.",
    icon: Brain,
    color: "violet",
  },
  {
    key: "error",
    label: "Ошибка",
    short: "Ошибка",
    description: "Сравниваем предсказание с правильной меткой. Разница — это ошибка.",
    icon: AlertTriangle,
    color: "rose",
  },
  {
    key: "update",
    label: "Обновление весов",
    short: "Обновление",
    description: "Меняем веса на чуть-чуть в сторону уменьшения ошибки. И по кругу.",
    icon: RefreshCw,
    color: "fuchsia",
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/50", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-700", ring: "ring-emerald-400 dark:ring-emerald-600" },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/50", text: "text-teal-700 dark:text-teal-300", border: "border-teal-300 dark:border-teal-700", ring: "ring-teal-400 dark:ring-teal-600" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/50", text: "text-amber-700 dark:text-amber-300", border: "border-amber-300 dark:border-amber-700", ring: "ring-amber-400 dark:ring-amber-600" },
  violet: { bg: "bg-violet-100 dark:bg-violet-900/50", text: "text-violet-700 dark:text-violet-300", border: "border-violet-300 dark:border-violet-700", ring: "ring-violet-400 dark:ring-violet-600" },
  rose: { bg: "bg-rose-100 dark:bg-rose-900/50", text: "text-rose-700 dark:text-rose-300", border: "border-rose-300 dark:border-rose-700", ring: "ring-rose-400 dark:ring-rose-600" },
  fuchsia: { bg: "bg-fuchsia-100 dark:bg-fuchsia-900/50", text: "text-fuchsia-700 dark:text-fuchsia-300", border: "border-fuchsia-300 dark:border-fuchsia-700", ring: "ring-fuchsia-400 dark:ring-fuchsia-600" },
};

export function Module07Cycle() {
  const accent = ACCENTS[7];
  const [activeStage, setActiveStage] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [laps, setLaps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        setActiveStage((s) => {
          const next = (s + 1) % STAGES.length;
          if (next === 0) setLaps((l) => l + 1);
          return next;
        });
      }, 900);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay]);

  function step() {
    setActiveStage((s) => {
      const next = (s + 1) % STAGES.length;
      if (next === 0) setLaps((l) => l + 1);
      return next;
    });
  }

  function reset() {
    setAutoPlay(false);
    setActiveStage(0);
    setLaps(0);
  }

  return (
    <ModuleShell
      id={7}
      title="Весь процесс целиком в одной цепочке"
      subtitle="Обучение — это не шаг, а цикл. Пройдём по нему один раз, потом второй, сотый, тысячный — пока ошибка не станет маленькой."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        увидеть весь процесс целиком и запомнить последовательность шагов.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Если собрать всё, что мы уже разобрали, в одну картинку, получится
          кольцо. Не прямая, а именно кольцо — потому что после обновления
          весов мы возвращаемся к началу и прогоняем данные заново:
        </p>
        <pre className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 rounded p-3 text-xs overflow-x-auto not-prose">
{`данные → признаки → веса → предсказание → ошибка → обновление весов → новый проход
   ↑                                                                    │
   └────────────────────────────────────────────────────────────────────┘`}
        </pre>
        <p>
          Один проход по этому кольцу — это <strong>одна эпоха</strong>.
          Обычно таких проходов десятки, сотни или тысячи. С каждым
          проходом веса становятся чуть-чуть лучше, а ошибка — чуть-чуть
          меньше. Останавливаются, когда ошибка перестаёт уменьшаться (или
          начинает расти — это значит, что модель начала переобучаться).
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Песочница: прокрути цикл обучения">
        <p className="text-sm text-muted-foreground">
          Нажимай «Шаг вперёд» или запусти автоплей. Каждый оборот кольца —
          одна эпоха обучения.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button
            type="button"
            onClick={() => {
              setAutoPlay(false);
              step();
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            Шаг вперёд
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
          <div className="ml-auto text-sm">
            <span className="text-muted-foreground">Пройдено эпох: </span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{laps}</span>
          </div>
        </div>

        {/* Круговая схема */}
        <div className="relative mx-auto max-w-[520px] aspect-square">
          <svg viewBox="0 0 400 400" className="w-full h-full text-muted-foreground/60">
            {/* Кольцо со стрелками */}
            <circle
              cx={200}
              cy={200}
              r={140}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />
            {/* Стрелка по направлению движения */}
            {(() => {
              const angle = (activeStage / STAGES.length) * Math.PI * 2 - Math.PI / 2;
              const r = 140;
              const cx = 200 + r * Math.cos(angle);
              const cy = 200 + r * Math.sin(angle);
              return (
                <circle cx={cx} cy={cy} r={6} fill="#059669" opacity={0.5}>
                  <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })()}
          </svg>

          {/* Узлы кольца */}
          {STAGES.map((stage, idx) => {
            const angle = (idx / STAGES.length) * Math.PI * 2 - Math.PI / 2;
            const r = 42; // % от половины
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            const c = COLOR_MAP[stage.color];
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.key}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg p-2 border-2 transition-all w-[90px] text-center",
                  c.bg,
                  c.border,
                  c.text,
                  isActive ? "scale-110 ring-4 " + c.ring : "opacity-70 hover:opacity-100"
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <stage.icon className="h-5 w-5 mx-auto mb-1" />
                <div className="text-[11px] font-semibold leading-tight">
                  {stage.short}
                </div>
              </button>
            );
          })}

          {/* Центральный круг с описанием */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card border-2 border-emerald-300 dark:border-emerald-700 rounded-full w-40 h-40 flex flex-col items-center justify-center text-center p-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300 font-semibold">
                Эпоха
              </div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{laps + 1}</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {STAGES[activeStage].label}
              </div>
            </div>
          </div>
        </div>

        {/* Описание активного этапа */}
        <div
          className={cn(
            "rounded-lg border-2 p-4 mt-4",
            COLOR_MAP[STAGES[activeStage].color].border,
            COLOR_MAP[STAGES[activeStage].color].bg
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            {(() => {
              const Icon = STAGES[activeStage].icon;
              return (
                <Icon className={cn("h-5 w-5", COLOR_MAP[STAGES[activeStage].color].text)} />
              );
            })()}
            <span
              className={cn(
                "font-bold",
                COLOR_MAP[STAGES[activeStage].color].text
              )}
            >
              Шаг {activeStage + 1}: {STAGES[activeStage].label}
            </span>
          </div>
          <p className="text-sm text-foreground/90">
            {STAGES[activeStage].description}
          </p>
        </div>

        {/* Линейная цепочка для мобильных */}
        <div className="mt-4 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[600px]">
            {STAGES.map((stage, idx) => (
              <div key={stage.key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={cn(
                    "px-2.5 py-1.5 rounded text-xs font-medium border",
                    activeStage === idx
                      ? cn(COLOR_MAP[stage.color].bg, COLOR_MAP[stage.color].border, COLOR_MAP[stage.color].text)
                      : "bg-card border-border text-muted-foreground"
                  )}
                >
                  {stage.short}
                </button>
                {idx < STAGES.length - 1 && (
                  <span className="text-muted-foreground mx-0.5">→</span>
                )}
                {idx === STAGES.length - 1 && (
                  <span className="text-emerald-600 dark:text-emerald-400 mx-0.5">↻</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

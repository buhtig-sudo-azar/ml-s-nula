"use client";

import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRight, FunctionSquare, GitBranch, Repeat, Gauge, Type } from "lucide-react";

const TOKENIZATSIIA_URL = "https://tokenizatsiya-app.vercel.app/";

const NEXT_TOPICS = [
  {
    icon: FunctionSquare,
    title: "Функция потерь (loss function)",
    short: "Loss",
    description:
      "Формула, которая превращает «ошибку» в одно число, которое модель минимизирует. MSE — один из примеров. Бывают cross-entropy, hinge, MAE и десятки других.",
    accent: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50",
    url: "https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent",
    linkLabel: "Google ML Crash Course — Gradient & Loss",
  },
  {
    icon: GitBranch,
    title: "Градиентный спуск",
    short: "Gradient",
    description:
      "Алгоритм, который подсказывает, в какую сторону менять веса. По сути — «иди вниз по склону ошибки, пока не дойдёшь до дна».",
    accent: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50",
    url: "https://www.3blue1brown.com/lessons/gradient-descent",
    linkLabel: "3Blue1Brown — Gradient descent",
  },
  {
    icon: Repeat,
    title: "Backpropagation",
    short: "Backprop",
    description:
      "Способ эффективно считать градиенты для нейросетей со многими слоями. Без него глубокие сети были бы невозможно медленными.",
    accent: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50",
    url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
    linkLabel: "Karpathy — Backprop с нуля",
  },
  {
    icon: Gauge,
    title: "Learning rate и гиперпараметры",
    short: "LR",
    description:
      "Скорость обучения и другие «настройки сверху», которые не учатся сами, но сильно влияют на результат. Мы уже крутили его в модуле 4.",
    accent: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50",
    url: "https://playground.tensorflow.org",
    linkLabel: "TensorFlow Playground — живая песочница",
  },
];

export function Module10Next() {
  const accent = ACCENTS[10];

  return (
    <ModuleShell
      id={10}
      title="Дальше — конкретные алгоритмы"
      subtitle="Когда интуиция есть, можно переходить к именам того, что мы уже делали руками: градиентный спуск, функция потерь, backpropagation, learning rate."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        увидеть, как привычные уже шаги превращаются в конкретные алгоритмы — и подготовиться к их изучению.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Все 9 модулей выше были про <strong>интуицию</strong>: что
          считается, что меняется, почему это работает. Дальше начинается
          второй уровень — <strong>имена и формулы</strong> для тех же
          действий.
        </p>
        <p>
          Это как научиться ездить на велосипеде по ощущениям, а потом уже
          разбираться, как устроены передачи, тормоза и подшипники. Имея
          интуицию, ты будешь читать формулы не как магические символы, а
          как краткую запись того, что уже понимаешь.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Что изучать дальше">
        <div className="grid sm:grid-cols-2 gap-3">
          {NEXT_TOPICS.map((t) => (
            <Card key={t.short} className="p-4 border-red-200 dark:border-red-800/60">
              <div className="flex items-start gap-3">
                <div
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg " +
                    t.accent
                  }
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{t.title}</h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {t.short}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800/60 dark:bg-red-950/40 p-4 mt-2">
          <div className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
            Карта перехода
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-800/60">ошибка</Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800/60">функция потерь</Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800/60">градиент</Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800/60">backprop</Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800/60">обучение нейросети</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Каждый шаг — это формализация того, что ты уже делал руками в
            песочницах выше. Не прыгай через ступеньки: иди последовательно.
          </p>
        </div>
      </SandboxBlock>

      <SandboxBlock accent={accent} title="Главный совет перед следующим шагом">
        <div className="space-y-3 text-sm text-foreground/90">
          <p>
            <strong className="text-red-700 dark:text-red-300">Не начинай с формул.</strong>{" "}
            Сначала поиграй с интерактивными визуализациями (TensorFlow
            Playground, 3Blue1Brown). Когда станет «видно» — формулы
            превратятся в короткую запись уже понятого.
          </p>
          <p>
            <strong className="text-red-700 dark:text-red-300">Реализуй маленькое своими руками.</strong>{" "}
            Линейную регрессию на 20 строках NumPy или даже чистом JS — это
            лучший способ почувствовать, как градиент и learning rate
            связаны. В песочнице модуля 4 ты уже по сути это сделал.
          </p>
          <p>
            <strong className="text-red-700 dark:text-red-300">Не пытайся охватить всё сразу.</strong>{" "}
            После линейной регрессии логично идти в логистическую (для
            классификации, как в модуле 8), потом — в простую нейросеть с
            одним скрытым слоем, и только потом в трансформеры и LLM.
          </p>
        </div>
      </SandboxBlock>

      <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50/50 dark:border-red-800/60 dark:bg-red-950/30 p-4 text-center">
        <div className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300 font-semibold mb-1">
          Полный каталог ресурсов — ниже
        </div>
        <p className="text-sm text-muted-foreground">
          32 проверенные ссылки: курсы, видео, книги и интерактивные
          песочницы на русском и английском — в конце страницы.
        </p>
      </div>

      {/* Ссылка на продолжение темы: токенизация */}
      <a
        href={TOKENIZATSIIA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="p-5 border-2 border-purple-300 dark:border-purple-800/80 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40 hover:shadow-lg hover:border-purple-400 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md">
              <Type className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800/60">
                  Продолжение темы
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono">
                  9 модулей · новая песочница
                </Badge>
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Токенизация — как машины читают текст
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Отдельное приложение про то, как текст превращается в токены и
                числа, которыми оперируют GPT, BERT и Llama. Живые песочницы BPE
                и WordPiece прямо в браузере, разбор спецтокенов
                <code className="mx-1 px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono text-xs">&lt;PAD&gt;</code>
                <code className="mx-1 px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono text-xs">&lt;UNK&gt;</code>
                <code className="mx-1 px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono text-xs">[CLS]</code>
                и каталог токенизаторов популярных моделей.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-purple-700 dark:text-purple-300">
                <span className="text-sm font-medium">Открыть курс</span>
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-xs font-mono ml-1 text-muted-foreground">
                  tokenizatsiya-app.vercel.app
                </span>
              </div>
            </div>
          </div>
        </Card>
      </a>
    </ModuleShell>
  );
}

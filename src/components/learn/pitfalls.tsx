"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const PITFALLS: Array<{ wrong: string; right: string; why: string }> = [
  {
    wrong: "Сразу учить формулы градиентного спуска",
    right: "Сначала поиграть с подстройкой весов вручную",
    why: "Формулы без интуиции — это магия. С интуицией — короткая запись уже понятого.",
  },
  {
    wrong: "Думать, что модель «понимает» задачу",
    right: "Понимать, что модель просто подстраивает числа под ошибку",
    why: "Модель не рассуждает. Она минимизирует число на выходе функции потерь.",
  },
  {
    wrong: "Считать, что больший датасет всегда лучше",
    right: "Качество разметки важнее количества",
    why: "10 000 примеров с 30% ошибочных меток дадут худшую модель, чем 500 чистых.",
  },
  {
    wrong: "Пробовать сразу нейросети и трансформеры",
    right: "Начать с линейной регрессии и логистической",
    why: "Сложные модели строятся на тех же идеях, но прячут их за слоями. Базу нужно видеть явно.",
  },
  {
    wrong: "Гнаться за 100% точностью на обучении",
    right: "Следить за переобучением и проверять на отложенных данных",
    why: "Если модель запомнила обучающую выборку наизусть — она не обобщает, а зубрит.",
  },
  {
    wrong: "Игнорировать learning rate",
    right: "Подбирать LR осознанно и смотреть на график loss",
    why: "Слишком большой → расходимость. Слишком маленький → модель не учится за разумное время.",
  },
  {
    wrong: "Слепо доверять предсказаниям модели",
    right: "Помнить, что модель угадывает по статистике прошлого",
    why: "Будущего она не видит. Если данные не покрывают ситуацию — модель выдаст правдоподобный бред.",
  },
  {
    wrong: "Смешивать признаки, веса и метки",
    right: "Всегда чётко разделять: вход / что настраивается / правильный ответ",
    why: "Без этого тройного разделения обучение превращается в кашу.",
  },
];

export function Pitfalls() {
  return (
    <section id="pitfalls" className="scroll-mt-24">
      <Card className="border-2 border-amber-200 dark:border-amber-800/60 overflow-hidden">
        <div className="bg-amber-50 px-5 py-4 border-b border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">
              Ошибки новичков — чего не делать
            </h2>
          </div>
          <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-1">
            Восемь типичных ловушек, в которые попадают почти все, кто
            начинает учить ML. Лучше знать заранее.
          </p>
        </div>
        <div className="p-5 space-y-3">
          {PITFALLS.map((p, i) => (
            <div
              key={i}
              className="grid sm:grid-cols-[1fr_1fr] gap-3 p-3 rounded-lg border bg-card hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-300 font-semibold">
                      Не делай так
                    </div>
                    <div className="text-sm text-foreground/90">{p.wrong}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300 font-semibold">
                      Делай так
                    </div>
                    <div className="text-sm text-foreground/90">{p.right}</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground sm:border-l sm:pl-3 sm:py-1 leading-relaxed">
                <span className="font-semibold text-foreground/80">Почему: </span>
                {p.why}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

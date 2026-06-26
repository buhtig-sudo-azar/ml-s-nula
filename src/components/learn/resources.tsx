"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type ResourceType = "course" | "article" | "video" | "interactive" | "book";
type Lang = "ru" | "en";
type Topic =
  | "general"
  | "terms"
  | "weights"
  | "error"
  | "training"
  | "data"
  | "algorithms"
  | "explanation";

type Resource = {
  title: string;
  url: string;
  language: Lang;
  type: ResourceType;
  description: string;
  topic_focus: Topic;
};

const RESOURCES: Resource[] = [
  {
    title: "Вкатываемся в Machine Learning с нуля за ноль рублей",
    url: "https://habr.com/ru/articles/774844",
    language: "ru",
    type: "article",
    description:
      "Подробный гайд по самостоятельному изучению ML: от Python и математики до классического ML и соревнований на Kaggle. Дорожная карта для новичка без бюджета.",
    topic_focus: "general",
  },
  {
    title: "Краткое введение в Машинное обучение",
    url: "https://habr.com/ru/articles/548010",
    language: "ru",
    type: "article",
    description:
      "Базовый разбор для тех, кто ищет «машинное обучение для чайников»: простыми словами про нейросети, веса, обучение итерациями и первый прогон данных.",
    topic_focus: "terms",
  },
  {
    title: "9 ключевых алгоритмов машинного обучения простым языком",
    url: "https://habr.com/ru/articles/509472",
    language: "ru",
    type: "article",
    description:
      "Обзор девяти главных алгоритмов МО человеческим языком без сложной математики. Помогает новичку понять, какие алгоритмы существуют и когда применяются.",
    topic_focus: "algorithms",
  },
  {
    title: "Искусственный интеллект для начинающих: как всё устроено",
    url: "https://habr.com/ru/articles/952700",
    language: "ru",
    type: "article",
    description:
      "Понятное введение в ИИ, ML и глубокое обучение: чем они отличаются, как данные превращаются в предсказания и какие задачи решают.",
    topic_focus: "explanation",
  },
  {
    title: "Открытый курс машинного обучения. Тема 1. Первичный анализ данных",
    url: "https://habr.com/ru/companies/ods/articles/322626",
    language: "ru",
    type: "article",
    description:
      "Первая тема знаменитого открытого курса ods.ai: работа с признаками и данными через Pandas. Прокачивает понимание признаков и меток на практике.",
    topic_focus: "data",
  },
  {
    title: "Введение в Data Science и машинное обучение — Stepik",
    url: "https://stepik.org/course/4852/promo",
    language: "ru",
    type: "course",
    description:
      "Курс от Сколково с видеолекциями и практикой, знакомящий с основами Data Science и ML. Подходит тем, кто только начинает путь.",
    topic_focus: "general",
  },
  {
    title: "Машинное обучение: Начальный уровень — Stepik",
    url: "https://stepik.org/course/8057/promo",
    language: "ru",
    type: "course",
    description:
      "Вводный курс про большие данные: обработка пропусков, аномалий и знакомство с моделями. Мягкий старт без сильной математики.",
    topic_focus: "general",
  },
  {
    title: "Быстрый старт в искусственный интеллект — Stepik",
    url: "https://stepik.org/course/80782/promo",
    language: "ru",
    type: "course",
    description:
      "Четырёхнедельный курс по основам ИИ и МО. Структурированный путь для тех, кто хочет быстро получить общую картину.",
    topic_focus: "general",
  },
  {
    title: "Машинное обучение. Вводная лекция — К.В. Воронцов",
    url: "https://www.youtube.com/watch?v=SZkrxWhI5qM",
    language: "ru",
    type: "video",
    description:
      "Вводная лекция классика российского ML: вводит объекты, признаки, метки и постановку задач обучения по прецедентам. Лучшее на русском объяснение базовой терминологии.",
    topic_focus: "terms",
  },
  {
    title: "Введение в Машинное Обучение (новая парадигма программирования)",
    url: "https://www.youtube.com/watch?v=qu_WEHvGXWk",
    language: "ru",
    type: "video",
    description:
      "Видеообъяснение сути ML как парадигмы, где правила не задаются явно, а извлекаются из данных. Помогает новичку понять концепцию обучения модели.",
    topic_focus: "explanation",
  },
  {
    title: "Машинное обучение — плейлист для новичков",
    url: "https://www.youtube.com/playlist?list=PLA0M1Bcd0w8zxDIDOTQHsX68MCDOAJDtj",
    language: "ru",
    type: "video",
    description:
      "Структурированный плейлист с азов: что такое машинное обучение, обучающая выборка, признаковое пространство. Идёт от простых понятий к задачам.",
    topic_focus: "terms",
  },
  {
    title: "Model Weights — Что такое веса модели в ИИ? — Ultralytics",
    url: "https://www.ultralytics.com/ru/glossary/model-weights",
    language: "ru",
    type: "article",
    description:
      "Глоссарная статья, доходчиво объясняющая веса как обучаемые параметры, преобразующие входные данные в предсказания. Закрывает тему «веса».",
    topic_focus: "weights",
  },
  {
    title: "Азбука ИИ: «Машинное обучение» — N+1",
    url: "https://nplus1.ru/material/2016/09/06/mistakesflow",
    language: "ru",
    type: "article",
    description:
      "Научно-популярный разбор на примере предсказания веса по росту: показывает, как подбираются коэффициенты и возникает ошибка. Наглядно для интуиции.",
    topic_focus: "explanation",
  },
  {
    title: "Признак (машинное обучение) — Википедия",
    url: "https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D0%BA_(%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5)",
    language: "ru",
    type: "article",
    description:
      "Классическое определение признака как измеримого свойства наблюдаемого явления и обсуждение выбора информативных признаков. Чёткая опора по теме «признаки».",
    topic_focus: "data",
  },
  {
    title: "Курсы по машинному обучению на русском — Neurohive",
    url: "https://neurohive.io/ru/novosti/besplatnye-kursy-mashinnoe-obuchenie",
    language: "ru",
    type: "article",
    description:
      "Подборка из 17 русскоязычных курсов по ML, Data Science и Python, включая курс Эндрю Ына. Удобный каталог для выбора старта.",
    topic_focus: "general",
  },
  {
    title: "Machine Learning Crash Course — Google for Developers",
    url: "https://developers.google.com/machine-learning/crash-course",
    language: "en",
    type: "course",
    description:
      "15-часовой курс Google с анимированными видео, интерактивными визуализациями и практикой. Классика для старта: от признаков и меток до градиентного спуска и функций потерь.",
    topic_focus: "general",
  },
  {
    title: "Linear regression: Gradient descent — Google ML Crash Course",
    url: "https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent",
    language: "en",
    type: "article",
    description:
      "Конкретный модуль, где градиентный спуск объясняется как итеративный поиск весов и смещения, минимизирующих потери. Идеален для тем «gradient descent» и «loss».",
    topic_focus: "error",
  },
  {
    title: "Intro to Machine Learning — Kaggle",
    url: "https://www.kaggle.com/learn/intro-to-machine-learning",
    language: "en",
    type: "interactive",
    description:
      "Трёхчасовой интерактивный микро-курс: вы строите первые модели прямо в браузере, изучая признаки, целевые метки и предсказания. Минимум теории, максимум практики.",
    topic_focus: "general",
  },
  {
    title: "Learn Python, Data Viz, Pandas & ML — Kaggle Learn",
    url: "https://www.kaggle.com/learn",
    language: "en",
    type: "interactive",
    description:
      "Каталог из 12 микро-курсов по 1–7 часов каждый: Python, Pandas, ML, feature engineering. Удобно собирать знания короткими сессиями с автопроверкой.",
    topic_focus: "general",
  },
  {
    title: "Intermediate Machine Learning — Kaggle",
    url: "https://www.kaggle.com/learn/intermediate-machine-learning",
    language: "en",
    type: "interactive",
    description:
      "Продолжение микро-курсов Kaggle: работа с пропусками, нечисловыми признаками, утечкой данных и инженерией признаков. Закрепляет темы «признаки» и подготовку данных.",
    topic_focus: "data",
  },
  {
    title: "Machine Learning for Beginners — Microsoft (open source)",
    url: "https://microsoft.github.io/ML-For-Beginners",
    language: "en",
    type: "course",
    description:
      "12-недельная, 26-урочная учебная программа по классическому ML с заданиями и проектами от Microsoft. Полностью открытая и нацелена именно на начинающих.",
    topic_focus: "general",
  },
  {
    title: "But what is a Neural Network? — 3Blue1Brown",
    url: "https://www.3blue1brown.com/lessons/neural-networks",
    language: "en",
    type: "video",
    description:
      "Эталонное визуальное объяснение нейросети: пиксели → веса и смещения → выходы. Лучшая интуиция по теме «веса» без формул, понятная даже школьнику.",
    topic_focus: "terms",
  },
  {
    title: "Gradient descent, how neural networks learn — 3Blue1Brown",
    url: "https://www.3blue1brown.com/lessons/gradient-descent",
    language: "en",
    type: "video",
    description:
      "Наглядная анимация того, как функция потерь и градиентный спуск заставляют сеть «учиться». Эталон для тем «loss function» и «gradient descent».",
    topic_focus: "error",
  },
  {
    title: "Neural Networks: Zero to Hero — Andrej Karpathy",
    url: "https://karpathy.ai/zero-to-hero.html",
    language: "en",
    type: "course",
    description:
      "Курс от Andrej Karpathy: постройка нейросетей с нуля в коде, начиная с backpropagation и micrograd. Лучшее объяснение обучения и обратного распространения «руками».",
    topic_focus: "training",
  },
  {
    title: "The spelled-out intro to neural networks and backpropagation — Karpathy",
    url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
    language: "en",
    type: "video",
    description:
      "Первая лекция серии Karpathy: с нуля реализуется backpropagation, показывая, как градиенты и learning rate двигают веса. Прямое попадание в темы «backpropagation» и «learning rate».",
    topic_focus: "training",
  },
  {
    title: "Dive into Deep Learning (d2l.ai)",
    url: "https://d2l.ai",
    language: "en",
    type: "book",
    description:
      "Интерактивный учебник с кодом на PyTorch/NumPy/TensorFlow, принятый в 500+ университетах. Совмещает концепции, математику и runnable-ноутбуки.",
    topic_focus: "algorithms",
  },
  {
    title: "Neural Networks and Deep Learning — Michael Nielsen",
    url: "http://neuralnetworksanddeeplearning.com",
    language: "en",
    type: "book",
    description:
      "Онлайн-учебник, специально написанный для новичков: как нейросети распознают цифры, что такое веса, смещения и обучение через градиентный спуск. Очень доступный стиль.",
    topic_focus: "terms",
  },
  {
    title: "Machine Learning Specialization — Andrew Ng (Coursera, free audit)",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
    language: "en",
    type: "course",
    description:
      "Обновлённая специализация Эндрю Ына от Stanford/DeepLearning.AI с открытым аудитом. Золотой стандарт вводного курса: линейная регрессия, градиентный спуск, функции потерь.",
    topic_focus: "general",
  },
  {
    title: "A Neural Network Playground — TensorFlow",
    url: "https://playground.tensorflow.org",
    language: "en",
    type: "interactive",
    description:
      "Интерактивная песочница в браузере: меняйте слои, нейроны, learning rate и наблюдайте обучение и веса в реальном времени. Лучший инструмент для интуиции по «learning rate» и «training».",
    topic_focus: "training",
  },
  {
    title: "What is Gradient Descent? — IBM",
    url: "https://www.ibm.com/think/topics/gradient-descent",
    language: "en",
    type: "article",
    description:
      "Чёткое корпоративное объяснение градиентного спуска как алгоритма оптимизации, минимизирующего ошибку между предсказаниями и реальными значениями. Хорошая текстовая опора.",
    topic_focus: "error",
  },
  {
    title: "A Data Scientist's Guide to Gradient Descent and Backpropagation — NVIDIA",
    url: "https://developer.nvidia.com/blog/a-data-scientists-guide-to-gradient-descent-and-backpropagation-algorithms",
    language: "en",
    type: "article",
    description:
      "Статья NVIDIA, связывающая градиентный спуск и обратное распространение: как нейросети учатся на датасетах через корректировку весов. Закрывает связку тем «training» и «backpropagation».",
    topic_focus: "training",
  },
  {
    title: "7 free online MIT courses to grasp machine learning",
    url: "https://openlearning.mit.edu/news/7-free-online-mit-courses-grasp-machine-learning",
    language: "en",
    type: "course",
    description:
      "Подборка курсов MIT по математике и основам ML для глубокого понимания. Авторитетный источник для тех, кто хочет фундаментальный английский путь.",
    topic_focus: "general",
  },
];

const TYPE_LABELS: Record<ResourceType, string> = {
  course: "Курс",
  article: "Статья",
  video: "Видео",
  interactive: "Интерактив",
  book: "Книга",
};

const TOPIC_LABELS: Record<Topic, string> = {
  general: "Общее",
  terms: "Термины",
  weights: "Веса",
  error: "Ошибка / Loss",
  training: "Обучение",
  data: "Данные",
  algorithms: "Алгоритмы",
  explanation: "Идея ML",
};

export function Resources() {
  const [langFilter, setLangFilter] = useState<Lang | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      if (langFilter !== "all" && r.language !== langFilter) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      return true;
    });
  }, [langFilter, typeFilter]);

  const ruCount = RESOURCES.filter((r) => r.language === "ru").length;
  const enCount = RESOURCES.filter((r) => r.language === "en").length;

  return (
    <section id="resources" className="scroll-mt-24">
      <Card className="border-2 border-teal-200 dark:border-teal-800/60 overflow-hidden">
        <div className="bg-teal-50 px-5 py-4 border-b border-teal-200 dark:bg-teal-950/40 dark:border-teal-800/60">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-700 dark:text-teal-300" />
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200">
              Обучающие ресурсы
            </h2>
          </div>
          <p className="text-sm text-teal-700/80 dark:text-teal-300/80 mt-1">
            {RESOURCES.length} проверенных ссылок:{" "}
            <strong>{ruCount} на русском</strong> и{" "}
            <strong>{enCount} на английском</strong>. Курсы, видео, статьи,
            книги и интерактивные песочницы — собрано, отсортировано и
            проанализировано.
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Фильтры */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>Язык:</span>
            </div>
            <div className="flex gap-1.5">
              {(["all", "ru", "en"] as const).map((l) => (
                <Button
                  key={l}
                  type="button"
                  size="sm"
                  variant={langFilter === l ? "default" : "outline"}
                  onClick={() => setLangFilter(l)}
                  className={cn(
                    "h-7 px-2.5 text-xs",
                    langFilter === l && "bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600"
                  )}
                >
                  {l === "all" ? "Все" : l === "ru" ? "Русский" : "English"}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
              <span>Тип:</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "course", "video", "article", "interactive", "book"] as const).map(
                (t) => (
                  <Button
                    key={t}
                    type="button"
                    size="sm"
                    variant={typeFilter === t ? "default" : "outline"}
                    onClick={() => setTypeFilter(t)}
                    className={cn(
                      "h-7 px-2.5 text-xs",
                      typeFilter === t && "bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600"
                    )}
                  >
                    {t === "all" ? "Все" : TYPE_LABELS[t]}
                  </Button>
                )
              )}
            </div>

            <div className="ml-auto text-xs text-muted-foreground">
              Показано: <span className="font-mono font-semibold">{filtered.length}</span> из {RESOURCES.length}
            </div>
          </div>

          {/* Список ресурсов */}
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group rounded-lg border border-border bg-card p-4 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {r.title}
                  </h3>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {r.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-mono",
                      r.language === "ru"
                        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60"
                        : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/60"
                    )}
                  >
                    {r.language === "ru" ? "RU" : "EN"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {TYPE_LABELS[r.type]}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono bg-muted/50">
                    {TOPIC_LABELS[r.topic_focus]}
                  </Badge>
                </div>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Нет ресурсов под выбранные фильтры. Сбрось фильтры.
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

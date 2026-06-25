"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ml-learning-theme-v1";

/**
 * Переключатель светлой/тёмной темы.
 * Фиксирован в правом верхнем углу, всегда виден при скролле.
 *
 * Чтобы избежать мигания темы при загрузке (FOUC), в layout.tsx
 * встроен inline-скрипт, который применяет тему до первого рендера React.
 */
export function ThemeToggle() {
  // На сервере и при первом рендере — false. Реальное значение прочитаем в useEffect.
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.classList.contains("dark");
    // Legitimate use: синхронизируем состояние React с темой, уже применённой
    // inline-скриптом в <head> до первого рендера (для предотвращения FOUC).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className={cn(
        "fixed top-3 right-3 z-50",
        "h-10 w-10 rounded-full",
        "flex items-center justify-center",
        "border border-border bg-card/90 backdrop-blur shadow-sm",
        "hover:bg-accent hover:shadow-md",
        "transition-all duration-150",
        "text-foreground",
        !mounted && "opacity-0"
      )}
    >
      {mounted && isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

/**
 * Inline-скрипт для предотвращения миграции темы (FOUC).
 * Вызывается в <head> до рендера React: читает localStorage и
 * сразу ставит класс .dark на <html>, чтобы первый пейнт уже был в нужной теме.
 */
export function ThemeScript() {
  const code = `(function(){try{var k='${STORAGE_KEY}';var v=window.localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=v?v==='dark':m;if(dark){document.documentElement.classList.add('dark');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

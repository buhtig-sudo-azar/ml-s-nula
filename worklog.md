---
Task ID: folio-card-redo
Agent: main
Task: Переделать карточку ml-s-nula в folio-portfolio (более современная/приятная)

Work Log:
- Проверил состояние: прежний скриншот 2688x1536 (2x DPR), localStorage-ключ темы был неверный (`theme` вместо `ml-learning-theme-v1`), композиция была «хиро + заголовок модуля 1» — без интерактива
- Изучил стандарт других карточек в folio-portfolio: 1344x768 (16:9), PNG/JPEG
- Переписал /home/z/my-project/scripts/shot-folio-ml-s-nula.mjs:
  - deviceScaleFactor: 1 → итоговое разрешение 1344x768 (как у остальных)
  - Исправил localStorage-ключ на `ml-learning-theme-v1` (как в theme-toggle.tsx)
  - Использую ctx.addInitScript чтобы тема применилась ДО первого рендера (без FOUC)
  - Жду 2 секунды после networkidle для шрифтов и анимаций
  - Композиция: хиро + sticky-nav + начало модуля 1 с теорией и песочницей
- Запустил скрипт, сохранил карточку + favicon
- Проверил результат PIL: 1344x768, средняя яркость 24.1/255 (тёмная тема применена корректно)

Stage Summary:
- Новая карточка: /home/z/my-project/tmp-work/folio-portfolio/assets/img/projects/ml-s-nula.png (1344x768, 106KB)
- Favicon обновлён: /home/z/my-project/tmp-work/folio-portfolio/favicons/ml-s-nula.png
- Скрипт сохранён в /home/z/my-project/scripts/shot-folio-ml-s-nula.mjs (для повторного запуска)

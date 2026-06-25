#!/bin/bash
# Скрипт капитальной проверки всех ссылок ресурсов.
# Делает запрос с user-agent как у браузера, следует редиректам,
# показывает финальный HTTP-статус и время ответа.

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Список всех 32 ссылок из resources.tsx
URLS=(
  "https://habr.com/ru/articles/774844"
  "https://habr.com/ru/articles/548010"
  "https://habr.com/ru/articles/509472"
  "https://habr.com/ru/articles/952700"
  "https://habr.com/ru/companies/ods/articles/322626"
  "https://stepik.org/course/4852/promo"
  "https://stepik.org/course/8057/promo"
  "https://stepik.org/course/80782/promo"
  "https://www.youtube.com/watch?v=SZkrxWhI5qM"
  "https://www.youtube.com/watch?v=qu_WEHvGXWk"
  "https://www.youtube.com/playlist?list=PLA0M1Bcd0w8zxDIDOTQHsX68MCDOAJDtj"
  "https://www.ultralytics.com/ru/glossary/model-weights"
  "https://nplus1.ru/material/2016/09/06/mistakesflow"
  "https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D0%BA_(%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5)"
  "https://neurohive.io/ru/novosti/besplatnye-kursy-mashinnoe-obuchenie"
  "https://developers.google.com/machine-learning/crash-course"
  "https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent"
  "https://www.kaggle.com/learn/intro-to-machine-learning"
  "https://www.kaggle.com/learn"
  "https://www.kaggle.com/learn/intermediate-machine-learning"
  "https://microsoft.github.io/ML-For-Beginners"
  "https://www.3blue1brown.com/lessons/neural-networks"
  "https://www.3blue1brown.com/lessons/gradient-descent"
  "https://karpathy.ai/zero-to-hero.html"
  "https://www.youtube.com/watch?v=VMj-3S1tku0"
  "https://d2l.ai"
  "http://neuralnetworksanddeeplearning.com"
  "https://www.coursera.org/specializations/machine-learning-introduction"
  "https://playground.tensorflow.org"
  "https://www.ibm.com/think/topics/gradient-descent"
  "https://developer.nvidia.com/blog/a-data-scientists-guide-to-gradient-descent-and-backpropagation-algorithms"
  "https://openlearning.mit.edu/news/7-free-online-mit-courses-grasp-machine-learning"
)

i=1
ok=0
bad=0
echo "=== Проверка ${#URLS[@]} ссылок ==="
for url in "${URLS[@]}"; do
  # Используем -L (следовать редиректам), -s (тихо), -o /dev/null (не печатать тело),
  # -w (формат вывода), --max-time 25 (таймаут), -A (user-agent),
  # --head с fallback на GET если HEAD не поддерживается
  result=$(curl -L -s -o /dev/null \
    -A "$UA" \
    --max-time 25 \
    -w "%{http_code}|%{time_total}|%{url_effective}" \
    -X HEAD "$url" 2>/dev/null)
  code=$(echo "$result" | cut -d'|' -f1)
  # Если HEAD дал 405/403/400 — пробуем GET
  if [[ "$code" == "405" || "$code" == "403" || "$code" == "400" || "$code" == "000" || "$code" == "404" ]]; then
    result=$(curl -L -s -o /dev/null \
      -A "$UA" \
      --max-time 25 \
      -r 0-2048 \
      -w "%{http_code}|%{time_total}|%{url_effective}" \
      "$url" 2>/dev/null)
    code=$(echo "$result" | cut -d'|' -f1)
  fi
  time=$(echo "$result" | cut -d'|' -f2)
  eff=$(echo "$result" | cut -d'|' -f3)
  if [[ "$code" == "200" || "$code" == "301" || "$code" == "302" || "$code" == "304" ]]; then
    status="OK"
    ok=$((ok+1))
  else
    status="FAIL"
    bad=$((bad+1))
  fi
  printf "%2d. [%s] %s  code=%s  time=%ss\n" "$i" "$status" "$url" "$code" "$time"
  i=$((i+1))
done

echo ""
echo "=== Итог: OK=$ok, FAIL=$bad, всего=${#URLS[@]} ==="

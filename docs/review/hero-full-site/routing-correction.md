# Исправление подключения Hero в реальных статьях

Предыдущий отчёт о переносе Hero на все статьи был неверным: импорт под именем ArticleBlocksTemplate в реальных маршрутах вёл в ApprovedArticle1–6, а не в базовый шаблон. Условная проверка if(hero) пропускала отсутствие компонента.

Исправление: все6 ApprovedArticle-шаблонов подключают уже согласованный EditorialHero. Изменён только Hero. Реальные12 статей и2 подборки обязательно проверяются новым sitemap-derived smoke; он сначала упал на12 статьях, затем прошёл после исправления. Гейт добавлен в npm run ci после production-shaped build. Responsive QA теперь отдельно требует наличие Hero.

Проверки: source check0 errors/0 warnings; build PASS; all14 rendered Hero PASS; local36/live36 responsive checks PASS. DOM всех50 main вне заменённого Hero сохранён. Главная HTML побайтно прежняя. На Джино заменены только12 HTML статей, с проверкой хешей, приватной резервной копией и rollback. Production/хостинг/API не менялись.

Это исправленное превью для приёмки, не разрешение на production или merge. Полный CI — отдельный gate.

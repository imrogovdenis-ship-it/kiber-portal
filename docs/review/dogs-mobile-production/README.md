# Узкая production-правка

Владелец утвердил вариант D на техническом домене и разрешил публикацию: только мобильные сценарные карточки /roboty-sobaki/; desktop/tablet остаются слайдером. Содержание, фотографии, Hero, галерея, SEO и остальные блоки не меняются. Реализация: page-scoped CSS внутри mobile media query.

Вторая просьба — убрать Скоро со всех карточек «Роботы-собаки вместо цветов». Read-only аудит 42 production sitemap routes нашёл 16 таких карточек: все уже <a href="/roboty-sobaki/"> с CTA «Подробнее», без disabled. Главная и /compilations/ без www перенаправляются на тот же www. Поэтому работающие страницы/карточки не редактируются. Аудит приложен.

Новый тест mobile CSS: RED (нет media layout) → GREEN; guard сохраняет источник разметки/контента вне style. Полный verify/build, scoped browser geometry/vertical touch/desktop carousel и CI обязательны до production. Деплой только изменившегося HTML подборки и нового CSS; сохранение rollback-копии, assets перед HTML, затем HTTP hash parity и live mobile/desktop. Preview повторно не публикуется.

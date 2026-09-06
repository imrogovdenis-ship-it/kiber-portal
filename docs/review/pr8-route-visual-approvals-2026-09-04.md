# PR8 route-level visual approvals — 2026-09-04

## Owner decision

Александр утвердил визуальный дизайн следующих страниц/типов во всех трёх версиях: mobile/телефон, tablet/планшет, desktop/ПК.

> На дизайн мобильной версии и версии для планшета для страницы блок кибергоша тоже утверждаем получается что мы должны утвердить и сделать все соответствующие записи в проекте по страницам главное подборки блок кибергоши и карточка робота все эти страницы визуальное утверждены во всех версиях мобильная десктопная и планшет зафиксирую все эти изменения и перейдём к следующему к следующей задаче

## Approved routes / page types

| Страница / тип | Route / preview | Mobile | Tablet | Desktop |
|---|---|---:|---:|---:|
| Главная | `/` | approved | approved | approved |
| Подборки | `/compilations/` | approved | approved | approved |
| Блог Кибер Гоши | `/articles/` | approved | approved | approved |
| Карточка робота | `/preview/kiber-94/robot-card/arenda-unitree-g1/` | approved | approved | approved |
| Шаблон статьи / article_detail | `/preview/kiber-94/article-blocks/` | approved | approved | approved |

## Shared CTA2 note

Блок `CTA2 / Остались вопросы?` должен оставаться единым shared-дизайном для всех текущих страниц, где он используется. Планшетный вариант утверждён sitewide; desktop-вариант после уменьшения и вертикального центрирования Гоши также входит в текущую visual approval рамку для перечисленных страниц.

## Evidence / records

- Machine-readable record: `data/review/pr8-route-visual-approvals.json`
- Full-site QA package: `data/review/full-site-visual-qa.json`
- Full-site QA README: `docs/review/kiber-91-full-site-visual-qa/README.md`
- Robot-card approval record: `data/review/kiber-94-robot-card-design-structure-approval.json`
- Current review URL base: https://alex-kiber-pr8-footer-review.38.180.37.42.nip.io
- Recorded at HEAD: `d190abc3acd1a86b8b551834bfd90e537aa3c06a`


## Article template approval — 2026-09-04

Александр утвердил страницу-шаблон статьи `/preview/kiber-94/article-blocks/` как канонический шаблон статей: дизайн, структуру и смыслы для ПК, планшета и мобильной версии.

> Всё утверждаю эту страницу шаблон для статей в том виде в котором она есть дизайн структуру и смыслы как ПК версию такой мобильную для планшетов вносить все необходимые информацию в проект файлы записываю всё что нужно

Record: `data/review/kiber-94-article-template-design-structure-approval.json`

Boundary: это template/visual approval, не merge/prod/DNS/secrets/analytics/live lead routing approval и не разрешение на массовую генерацию статей без отдельного content/SEO-прохода.

## Safety boundary

Это visual approval только для перечисленных страниц/типов и viewport. Это **не** PR merge approval и **не** production/DNS/secrets/analytics/live lead routing approval.

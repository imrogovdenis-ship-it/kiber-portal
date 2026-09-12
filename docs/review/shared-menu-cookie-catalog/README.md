# Общая тестовая сборка: меню, cookies, описания каталога

Preview: https://jino-preview.kiber-portal.ru/ — awaiting owner review. Production/merge not authorized by this review delivery.

- 24 коротких человеческих описания: отдельный JSON, применяется общим RobotCard; полные тексты и SEO страниц не менялись.
- Общий Header: явное закрытие, burger-toggle/Escape/outside/link close, мобильный tel из siteConfig. Навигация 14→16 CSS px, 400→600. Fixed logo remains in the same position after open even on scrolled page. Разная высота контейнера с учётом границы давала 0.5px смещение; open container теперь наследует ту же высоту 100%.
- Cookie component, равнозначные accept/reject, localStorage 180 days, reopen footer, fail-closed neutral analytics. Счётчики не подключались; уточнена только cookie policy.

Evidence: source tests RED/GREEN; npm run check PASS; production build PASS; local menu tests at 320/390/768/959/1440 PASS; cookie flow at 320/360/390/430/768/1440 and blocked storage PASS. Public preview browser 390/1440 PASS, 24 descriptions exact, no clipped descriptions, logo position/close/phone verified. 47 live HTML/script/style responses byte-identical to preview package. Preview headers noindex, API dry-run. No real lead sent.

Полный предыдущий local CI оборвался по timeout: НЕ объявлен PASS. Новая hosted проверка обязательна перед merge. Preview source/review approval ≠ merge/production permission.

Rollback: `/home/alex/.hermes/state/kiber-cookie-consent/preview-rollback.zip`, server copy outside web root under `.kiber-review-backups/`; secrets/config/DNS/production not changed. Temporary extractor/archive removed after successful extraction. Local screenshots and detailed logs in the same state directory.

Future pages must use shared Header/RobotCard/BaseLayout, not copy these changes into per-page variants. Any later analytics provider activation requires a separate decision and renewed consent/version after policy update.

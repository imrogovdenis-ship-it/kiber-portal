# Changelog дизайн-системы

## 2026-08-26

- PR №8 выбран единственной архитектурной линией; полезная проверка из PR №9 перенесена в корневой TypeScript validation gate;
- ADR-003 и визуальная иерархия переведены в статус «принято»;
- создана трёхуровневая token architecture;
- добавлены Zod-схемы, генераторы и validation gates;
- создан вертикальный пилот `05 / robot-card` с пятью fixtures;
- Montserrat по OFL утверждён единственным production-шрифтом для display и body; Gilroy отклонён и запрещён в runtime без нового лицензированного решения;
- добавлен закрываемый из production design-review registry.
- по KIBER-86 `reference-desktop-v9.html` и `reference-mobile-v3.html` закреплены как обязательная визуальная основа;
- добавлена schema-validated карта marker/selector для блоков 01–34 и CI gate прямой traceability visual-ready specs;
- добавлен первый parity-аудит блока 05 с явными legal/content/DOM overrides и открытыми решениями.

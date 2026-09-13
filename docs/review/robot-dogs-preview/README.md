# Robot-dog package: owner preview only

Review hub: https://jino-preview.kiber-portal.ru/preview/robot-dogs/

Seven approved content packages and seven owner illustrations are rendered by shared templates. No production publication or merge is authorized.

Owner feedback: Inchbot has a replaceable battery (no unsupported runtime copied from Go2). Exhibition roles: G1 attracts foot traffic, Promobot V4 supports promotional dialogue, Go2 is a mobile promoter with scrolling display and A6 handouts. Xiaomi/Inchbot are absent from that page.

## Verification
- Existing suite: 336/336 PASS; separate new adapter/integration suite: 6/6 PASS (now included in verify).
- New integration regressions demonstrated RED then GREEN: checkpoint text, shared CTA, correct AI summary field, preservation of launch navigation on older article.
- Preview and production builds exercised. New article/hub routes absent in production; compilation uses dynamic preview-only adapter import.
- 24 published robot cards + six old articles: generated production HTML unchanged after normalization of Astro scope/hash attributes.
- All seven source prose/checkpoints/FAQ/guide sentences retained in rendered pages.
- 14 public Jino browser checks: 390/1440, no overflow, no JS errors or tracker requests; within 1.5 MB initial / 1.8 MB full-scroll.
- 937 static files server hash parity; eight owner URLs HTTP byte parity. Protected runtime/settings preserved. Old preview rollback (945 files) downloaded and hash-verified privately; temporary remote helper/archive/backup removed.
- Production homepage hash unchanged. No real leads sent.

Build for preview: `DEPLOY_ENV=preview DESIGN_REVIEW_ENABLED=false npm run build`.
Build isolation: `npm run build:production`.
Gates: `npm run verify`, `npm run test:robot-dogs-preview` after preview build.

Research limitations: previous competitive evidence covers 14 read pages and official Unitree; fresh SERP is partial, not seven full rankings audits. This final pass applies owner feedback without broad copy rewrites.

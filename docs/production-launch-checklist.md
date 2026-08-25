# KIBER PORTAL — production launch checklist

Дата: 2026-08-24  
Статус: `draft_no_production_changes`

Этот чеклист готовит запуск, но **не активирует** DNS, деплой, редиректы, формы или аналитику без отдельного подтверждения.

## 1. Business inputs required

- [ ] Финальные реквизиты компании для `/contacts` и footer.
- [ ] Подтверждённые публичные каналы: телефон, email, Telegram, WhatsApp/Max если используются.
- [ ] Подтверждённый lead destination: форма, мессенджер, CRM или email.
- [ ] Подтверждённые цены/условия аренды, если они должны быть публичными.
- [ ] Утверждённые SEO-материалы Александра: ключи, синонимы, long-tail, статьи, подборки, alt-тексты.
- [ ] Заполнить/передать пакет из `docs/business-inputs-request.md`.
- [ ] Политика/согласие на аналитику и пиксели.

## 2. Technical gates before production

Run from `/home/alex/projects/kiber-portal`:

```bash
python3 scripts/validate_design_tokens.py --root . --json
python3 scripts/validate_public_pages.py --root . --json
npm --prefix app run build
python3 scripts/validate_robot_seo_links.py --root . --json
python3 scripts/validate_collection_pages.py --root . --json
python3 scripts/validate_content_index_pages.py --root . --json
python3 scripts/validate_content_detail_pages.py --root . --json
python3 scripts/validate_whole_site_static.py --root . --json
python3 scripts/audit_rendered_image_alt.py --root . --json
python3 scripts/audit_rendered_headings.py --root . --json
python3 scripts/generate_route_inventory.py --root .
python3 scripts/run_launch_qa.py
```

Required result before production:

```text
errors=0
warnings=0 for public validation gates
```

## 3. Preview QA

- [ ] Desktop screenshot: `/`
- [ ] Mobile screenshot: `/`
- [ ] Desktop/mobile: `/arenda-unitree-g1`
- [ ] Desktop/mobile: `/arenda-bellabot`
- [ ] Desktop/mobile: `/roboty-gumanoidy`
- [ ] Desktop/mobile: `/arenda-robotov-na-meropriyatie`
- [ ] Desktop/mobile: `/articles`
- [ ] Desktop/mobile: one article detail page
- [ ] Desktop/mobile: `/contacts`
- [ ] Browser console has no critical JS errors.
- [ ] Broken image check returns empty list on representative pages.

## 4. SEO/search readiness

- [ ] Canonical domain confirmed: `https://www.kiber-portal.ru`.
- [ ] Public routes in sitemap confirmed.
- [ ] Preview/noindex routes intentionally excluded from public blockers.
- [ ] Robots policy confirmed for production.
- [ ] Schema validated with external rich result/schema tools after deployment.
- [ ] Redirect map reviewed and approved.
- [ ] Search Console/Bing Webmaster setup planned after DNS/deploy.

## 5. Deployment safety

- [ ] Identify target Coolify app/container name before changing anything.
- [ ] Confirm rollback: previous image/commit or Coolify deployment rollback.
- [ ] Confirm environment variables and secrets are present without printing them.
- [ ] Confirm no unrelated AI Class containers/apps are touched.
- [ ] Run `docker ps`, app logs and `curl -I` after deploy.
- [ ] Keep existing production untouched until explicit launch approval.

## 6. Post-launch checks

- [ ] `curl -I https://www.kiber-portal.ru/` returns expected status.
- [ ] `curl -I https://www.kiber-portal.ru/sitemap-index.xml` returns expected status.
- [ ] Top public routes return 200 and correct canonical.
- [ ] Forms/messenger CTAs work against approved destination.
- [ ] Analytics events are received in approved analytics account.
- [ ] 404/redirect behavior verified.

## Current blocker summary

The static Astro build and validation gates pass. Production launch still needs business-approved contacts, lead destination, analytics settings, redirect approval and SEO enrichment materials before any infrastructure change.

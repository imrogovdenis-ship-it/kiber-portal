import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFile(resolve(root, path), 'utf8');

test('homepage header keeps logo future-proof and compact desktop controls', async () => {
  const header = await read('src/components/layout/Header.astro');
  const baseLayout = await read('src/layouts/BaseLayout.astro');
  const layout = await read('src/styles/layout.css');
  const reference = await read('src/styles/reference-layer.css');

  assert.match(header, /logo\?:\s*\{[^}]*src\?:\s*string[^}]*alt\?:\s*string/s);
  assert.match(header, /site-header__logo-mark/);
  assert.match(header, /site-header__logo-text/);
  assert.match(header, /site-header__logo--with-mark/);
  assert.match(baseLayout, /\/images\/brand\/kp_logo_full_color\.svg/);
  assert.match(layout, /\.site-header__logo--with-mark \.site-header__logo-text/);
  assert.match(layout, /\.site-header__nav\s*\{[^}]*margin-left:\s*1\.25rem;/s);
  assert.match(reference, /\.site-header__container\s*\{[^}]*width:\s*min\(100% - \(2 \* var\(--kp-reference-page-gutter\)\),\s*var\(--kp-reference-container\)\)/s);
  assert.match(reference, /\.site-header__nav\s*\{[^}]*gap:\s*0\.875rem;[^}]*margin-left:\s*0\.5rem;/s);
  assert.match(reference, /\.site-header__link\s*\{[^}]*font-size:\s*0\.875rem;/s);
  assert.match(reference, /\.site-header__cta\s*\{[^}]*min-height:\s*2\.125rem;[^}]*padding:\s*0\.5rem 1\.125rem;/s);
});

test('homepage hero is tighter, less oversized, and does not show hidden-condition stat chips', async () => {
  const page = await read('src/pages/index.astro');
  const hero = await read('src/components/blocks/HomeHero.astro');

  assert.doesNotMatch(page, /скрытых условий/i);
  assert.doesNotMatch(page, /value:\s*'0'/);
  assert.match(page, /padding-block:\s*clamp\(0\.75rem,\s*1\.5vw,\s*1\.5rem\) clamp\(1\.5rem,\s*3vw,\s*3rem\)/);
  assert.match(hero, /padding:\s*clamp\(0\.5rem,\s*1vw,\s*0\.875rem\) 0 0/);
  assert.match(hero, /min-height:\s*39\.6rem;/);
  assert.match(hero, /inset:\s*0 0 0 auto;/);
  assert.match(hero, /\.home-hero__actions\s*\{[^}]*margin-top:\s*0\.75rem;/s);
  assert.match(hero, /font-size:\s*clamp\(2\.5rem,\s*5vw,\s*5\.25rem\)/);
  assert.match(hero, /max-width:\s*14ch;/);
  assert.match(hero, /padding:\s*3\.15rem 0 3\.15rem 3\.75rem;/);
});

test('homepage catalog renders a four-card desktop grid with larger real robot images and card-wide links', async () => {
  const page = await read('src/pages/index.astro');
  const card = await read('src/components/blocks/RobotCard.astro');
  const reference = await read('src/styles/reference-layer.css');

  assert.match(page, /homeRobots\s*=\s*getFeaturedHomeRobots\(4\)/);
  assert.match(page, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(reference, /--kp-reference-container:\s*86rem;/);
  assert.match(reference, /--kp-reference-page-gutter:\s*4rem;/);
  assert.match(reference, /\.container\s*\{[^}]*width:\s*min\(100% - \(2 \* var\(--kp-reference-page-gutter\)\),\s*var\(--kp-reference-container\)\)/s);
  assert.match(reference, /\.vertical-slice__section\s*\{\s*padding:\s*0;\s*\}/s);
  assert.match(page, /<RobotCard[^>]*hideDisclaimer=\{true\}[^>]*hideLink=\{true\}[^>]*imageLoading="eager"/s);
  assert.doesNotMatch(page, /Не является публичной офертой/);
  assert.match(card, /<a\s+class:list=\{\['robot-card'/s);
  assert.match(card, /aria-label=\{`Открыть карточку робота/);
  assert.match(reference, /robot-card__badge[\s\S]*width:\s*clamp\(2\.625rem,\s*3\.4vw,\s*3\.125rem\)/);
  assert.match(card, /align-items:\s*center;[\s\S]*justify-items:\s*center;/);
});

test('homepage final CTA follows original blue strip, left-aligned white buttons, and reserves right-side mascot space', async () => {
  const cta = await read('src/components/blocks/CtaStrip.astro');

  assert.match(cta, /background:\s*var\(--kp-blue-deep\)/);
  assert.match(cta, /grid-template-columns:\s*minmax\(0,\s*0\.62fr\) minmax\(16rem,\s*0\.38fr\)/);
  assert.match(cta, /cta-strip__art/);
  assert.match(cta, /justify-content:\s*flex-start/);
  assert.match(cta, /font-weight:\s*500/);
  assert.match(cta, /background:\s*var\(--kp-white\);\s*color:\s*var\(--kp-ink\)/);
});

test('homepage footer follows owner footer composition feedback', async () => {
  const footer = await read('src/components/layout/Footer.astro');
  const layout = await read('src/styles/layout.css');
  const reference = await read('src/styles/reference-layer.css');

  assert.match(footer, /description:\s*'Аренда роботов для мероприятий\\nв Москве и по всей России\.'/);
  assert.match(footer, /<p class="site-footer__requisites"/);
  assert.match(footer, /<span>ИНН \{siteConfig\.inn\}<\/span>/);
  assert.match(footer, /<span>ОГРНИП \{siteConfig\.ogrnip\}<\/span>/);
  assert.match(footer, /footerAddress = `г\. \$\{siteConfig\.region\}, \$\{siteConfig\.address\}`/);
  assert.doesNotMatch(footer, /site-footer__region/);
  assert.match(footer, /title:\s*'Главное'/);
  assert.doesNotMatch(footer, /title:\s*'Меню'/);
  assert.doesNotMatch(footer, /title:\s*'Контент'/);
  assert.doesNotMatch(footer, /<h2 class="site-footer__title">\{section\.title\}<\/h2>/);
  assert.match(footer, /\{ href: '\/', label: 'Главное' \}/);
  assert.match(footer, /\{ href: '\/#catalog', label: 'Каталог' \}/);
  assert.match(footer, /\{ href: '\/compilations', label: 'Подборки' \}/);
  assert.match(footer, /\{ href: '\/articles', label: 'Блог' \}/);
  assert.match(footer, /\{ href: '\/news', label: 'Новости' \}/);
  assert.match(footer, /\{ href: '\/contacts', label: 'Контакты' \}/);
  assert.match(footer, /legal_notice:\s*'Все права защищены ©'/);
  assert.match(footer, /Политика обработки\\nперсональных данных/);
  assert.match(footer, /Согласие на обработку\\nперсональных данных/);
  assert.match(footer, /Политика использования\\nфайлов cookie/);
  assert.match(footer, /Пользовательское\\nсоглашение/);
  assert.match(layout, /\.site-footer\s*\{[^}]*background:\s*var\(--kp-footer-background\)/s);
  assert.match(layout, /\.site-footer__main\s*\{[^}]*grid-template-columns:[^;]*minmax\(17rem, 1\.65fr\)[^;]*minmax\(10rem, \.82fr\)/s);
  assert.match(layout, /\.site-footer__requisites\s*\{[^}]*display:\s*grid;[^}]*gap:\s*\.125rem;[^}]*margin:\s*0;/s);
  assert.match(layout, /\.site-footer__phone, \.site-footer__email, \.site-footer__address\s*\{[^}]*color:\s*var\(--kp-muted-soft\);[^}]*font-size:\s*\.875rem;[^}]*font-weight:\s*400;/s);
  assert.match(layout, /\.site-footer__legal a\s*\{[^}]*font-size:\s*\.75rem;[^}]*line-height:\s*1\.18;/s);
  assert.match(reference, /\.site-footer\s*\{[^}]*background:\s*var\(--kp-footer-background\)/s);
});

test('brand logos render as SVG marks in both header and footer without losing owner-provided colors', async () => {
  const [baseLayout, header, footer, logo, lint] = await Promise.all([
    read('src/layouts/BaseLayout.astro'),
    read('src/components/layout/Header.astro'),
    read('src/components/layout/Footer.astro'),
    read('public/images/brand/kp_logo_full_color.svg'),
    read('design-system/scripts/lint.ts'),
  ]);

  assert.match(baseLayout, /\/images\/brand\/kp_logo_full_color\.svg/);
  assert.match(header, /site-header__logo-mark/);
  assert.match(footer, /site-footer__logo-mark/);
  assert.match(footer, /\/images\/brand\/kp_logo_full_color\.svg/);
  assert.doesNotMatch(footer, /<a class="site-footer__logo" href="\/">\{logo_label\}<\/a>/);
  assert.match(logo, /#(?:0088FF|005EFF)/i);
  assert.doesNotMatch(logo, /currentColor/);
  assert.match(lint, /public\/images\/brand\/kp_logo_full_color\.svg/);
});

test('homepage owner-provided hero image is registered as media-use approval without production side effects', async () => {
  const page = await read('src/pages/index.astro');
  const registry = JSON.parse(await read('data/review/homepage-owner-media-assets.json'));

  assert.match(page, /\/images\/home\/home-header-robot-owner-20260830\.webp/);
  assert.equal(registry.policy.productionDeployChanged, false);
  assert.equal(registry.policy.dnsChanged, false);
  assert.equal(registry.policy.secretsChanged, false);
  assert.equal(registry.assets[0].src, '/images/home/home-header-robot-owner-20260830.webp');
  assert.equal(registry.assets[0].productionApproved, true);
  assert.equal(registry.assets[0].approvalScope, 'media_use_only_not_production_deploy');
});

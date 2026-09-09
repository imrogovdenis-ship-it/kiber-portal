import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync('src/pages/preview/kiber-94/compilation/roboty-gumanoidy/index.astro', 'utf8');
const component = readFileSync('src/components/templates/CompilationTemplate.astro', 'utf8');
const data = readFileSync('src/lib/kiber94-compilation-template-data.ts', 'utf8');

test('KIBER-94 compilation preview route is preview-only and uses reusable template', () => {
  assert.match(route, /noindex=\{true\}/);
  assert.match(route, /<CompilationTemplate \{template\} \/>/);
  assert.match(route, /buildHumanoidCompilationTemplate/);
  assert.match(route, /getRobotPages\(\)\.filter\(\(robot\) => robot\.category === 'humanoid'\)/);
  assert.match(route, /collectionPageJsonLd/);
  assert.match(route, /faqPageJsonLd/);
});

test('KIBER-94 compilation template combines old source block order with approved PR8 blocks', () => {
  assert.match(component, /data-page-type="compilation"/);
  assert.match(component, /data-template-status="draft_for_owner_review"/);
  assert.match(component, /humanoid-template h1 \{ max-width: 14ch; font-size: clamp\(2\.5rem, 5vw, 5\.25rem\); line-height: 1; \}/);
  assert.doesNotMatch(component, /humanoid-template h1 \{ font-size: clamp\(2\.85rem|humanoid-template h1 \{ font-size: clamp\(3rem/);
  assert.match(component, /data-block-id="hero"[\s\S]*data-block-id="intro"[\s\S]*data-block-id="introGosha"[\s\S]*data-block-id="gallery"[\s\S]*data-block-id="choiceGuide"[\s\S]*data-block-id="video"[\s\S]*data-block-id="scenarioExplanation"[\s\S]*data-block-id="goshaConclusion"[\s\S]*data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="otherCompilations"/);
  assert.match(component, /HomeGoshaQuote/);
  assert.match(component, /<HomeGoshaQuote \{\.\.\.template\.conclusionGosha\} sectionId="compilation-gosha-conclusion" \/>/);
  assert.doesNotMatch(component, /humanoid-template__conclusion-card/);
  assert.match(component, /HomeFaqBlock/);
  assert.match(component, /HomeFinalCta/);
  assert.match(component, /HomeImageCards/);
  assert.match(component, /import \{ homeCompilations \} from '\.\.\/\.\.\/data\/home-live'/);
  assert.match(component, /<HomeImageCards id="compilations" eyebrow="Подборки" \{\.\.\.homeCompilations\} \/>/);
  assert.match(component, /humanoid-template__bottom-compilations \{ padding-block: clamp\(3\.5rem, 6vw, 5\.25rem\) clamp\(4rem, 7vw, 6rem\); \}/);
  assert.doesNotMatch(component, /humanoid-template__other|humanoid-template__other-grid|humanoid-template__other-card/);
  assert.match(component, /RobotCard/);
  assert.match(component, /class="vertical-slice__section vertical-slice__section--catalog container"/);
  assert.match(component, /class="container" data-block-id="relatedArticles"/);
  assert.match(component, /class="container" data-block-id="faq"/);
  assert.match(component, /hideDisclaimer=\{true\} hideLink=\{true\} imageLoading="eager"/);
  assert.match(component, /data-drag-slider="robot-humanoid-compilation-gallery"/);
  assert.match(component, /data-slider-prev="\[data-drag-slider='robot-humanoid-compilation-gallery'\]"/);
  assert.match(component, /robot-card-gallery\.js/);
  assert.match(component, /humanoid-template__eyebrow--video/);
  assert.doesNotMatch(component, /humanoid-template__step > span[^{]*\{[^}]*justify-self: end/);
  assert.match(component, /font-size: clamp\(8rem, 15vw, 13\.5rem\)/);
  assert.match(component, /humanoid-template__section-head--scenarios-left/);
  assert.match(component, /humanoid-template__video \.humanoid-template__eyebrow--video \{ color: var\(--kp-blue\); font-size: var\(--kp-label-size\);/);
  assert.match(component, /humanoid-template__gallery-head \.humanoid-template__section-head,[\s\S]*humanoid-template__guide > \.humanoid-template__section-head \{ margin-left: var\(--kp-home-large-offset/);
  assert.match(component, /humanoid-template__section-head--scenarios-left \{[\s\S]*padding-inline: 0; padding-left: var\(--kp-home-large-offset/);
  assert.match(component, /data-drag-slider="robot-humanoid-scenarios-slider"/);
  assert.match(component, /humanoid-template \{[\s\S]*max-width: 100vw; overflow-x: clip/);
  assert.match(component, /data-slider-prev="\[data-drag-slider='robot-humanoid-scenarios-slider'\]"/);
  assert.match(component, /aspect-ratio: 9 \/ 16/);
  assert.match(component, /humanoid-template__scenario-caption/);
  assert.doesNotMatch(component, /humanoid-template__scenario-grid|background: #25222b; color: white/);
  assert.match(component, /width: min\(100% - \(var\(--kp-reference-page-gutter\) \* 2\), var\(--kp-reference-container\)\)/);
  assert.match(component, /color: color-mix\(in srgb, var\(--kp-reference-blue\) 9%, transparent\)/);
  assert.match(component, /humanoid-template h2 \{ max-width: 58rem; font-size: clamp\(2\.4rem, 5vw, var\(--kp-reference-heading-lg\)\); line-height: 1; \}/);
  assert.match(component, /padding-block: clamp\(2\.45rem, 4\.2vw, 3\.675rem\) clamp\(2\.45rem, 4\.2vw, 3\.675rem\)/);
  assert.match(component, /humanoid-template__gallery-strip \{ padding: 0 max\(var\(--kp-reference-page-gutter\), calc\(\(100vw - var\(--kp-reference-container\)\) \/ 2\)\) \.4rem; \}/);
});

test('KIBER-94 humanoid compilation data includes SEO and AI search layer without replacing robot cards', () => {
  assert.doesNotMatch(data, /humanoid-compilation-hero-group\.webp/);
  assert.match(data, /галерея должна сразу показать масштаб, пластику, мимику и сценическое присутствие гуманоидов/);
  assert.doesNotMatch(data, /5 моделей в подборке|ориентир за час|1 оператор/);
  assert.match(data, /Подборка \/ роботы-гуманоиды/);
  assert.match(data, /Каталог роботов/);
  assert.match(data, /conclusionGosha:/);
  assert.match(data, /primaryKeyword:\s*'аренда робота-гуманоида'/);
  assert.match(data, /secondaryKeywords:[\s\S]*прокат робота-гуманоида[\s\S]*робот-гуманоид на мероприятие[\s\S]*аренда человекоподобного робота/s);
  assert.match(data, /Эта сборка нужна как SEO-хаб и как понятная витрина выбора/);
  assert.match(data, /Сборка не заменяет карточку робота/);
  assert.match(data, /Кибер Гоша/);
  assert.match(data, /homeRobotCardFinalCta/);
  assert.match(data, /Фотографии гуманоидных роботов на мероприятиях/);
  assert.match(data, /Как гуманоид выглядит в деле/);
});


test('KIBER-94 compilation gallery preserves source formats at a common height', () => {
  assert.match(component, /humanoid-template__gallery-item \{[^}]*width: fit-content;[^}]*height: var\(--humanoid-gallery-height\)[^}]*background: transparent/);
  assert.match(component, /humanoid-template__gallery-item img \{[^}]*width: auto; height: 100%; max-width: none;[^}]*object-fit: contain/);
  assert.doesNotMatch(component, /humanoid-template__gallery-item \{[^}]*aspect-ratio: 1 \/ 1/);
  assert.doesNotMatch(component, /humanoid-template__gallery-item img \{[^}]*width: 100%/);
});

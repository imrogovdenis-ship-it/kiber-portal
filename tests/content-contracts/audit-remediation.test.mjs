import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
test('F01 homepage general CTA does not select a robot', () => {
  const page = read('src/pages/index.astro');
  const requestLinks = [...page.matchAll(/href:\s*['"](\/lead\/request[^'"]*)['"]/g)].map(m => m[1]);
  assert.ok(requestLinks.length);
  assert.ok(requestLinks.every(href => !new URL(href, 'https://example.test').searchParams.has('robot')));
});

test('F08 checklist template does not render an empty heading', () => {
  const template = read('src/components/templates/ArticleBlocksTemplate.astro').split('<section id="checkpointList"')[1].split('</section>')[0];
  assert.ok(template.includes('{item.title?.trim() && <h3>{item.title}</h3>}'), 'optional checklist title must be conditional');
});

test('F02 public contact paths have no disabled-routing copy', () => {
 for (const path of ['src/pages/contacts.astro','src/pages/lead/request.astro']) {
  assert.doesNotMatch(read(path), /Routing remains disabled|Capability-only|Автоматическая отправка формы в выбранный канал остаётся выключенной|Форма заявки появится только после|Live routing включается/);
 }
});

test('F03 direct thanks page has no unconditional success or fixed model', () => {
 const page=read('src/pages/lead/thanks.astro');
 assert.doesNotMatch(page,/Спасибо, бриф принят|Мы сохранили запрос|arenda-unitree-g1|после подключения/);
 assert.ok(page.includes('data-lead-thanks-message'));
});

test('F09 cards expose approved battery facts without cross-model duration', () => {
 const go=JSON.parse(read('data/content/robot-card-pilot/arenda-unitree-go2.json')).blocks;
 const inch=JSON.parse(read('data/content/robot-card-pilot/arenda-inchbot-l1-w-edu.json')).blocks;
 const cyber=JSON.parse(read('data/content/robot-card-pilot/arenda-xiaomi-cyberdog-2.json')).blocks;
 assert.match(go.capabilities[0].text,/сменн.*аккумулятор/i);assert.match(go.capabilities[0].text,/1,5–2 часа/);
 assert.match(inch.capabilities[1].text,/сменн.*аккумулятор/i);assert.doesNotMatch(inch.capabilities[1].text,/1,5|1.5|2 часа/);
 assert.match(cyber.capabilities[0].text,/перерыв на зарядку/);
});

test('battery card text stays synchronized with the approved registry', () => {
 for(const [slug,fact] of Object.entries(JSON.parse(read('data/content/robot-power-facts.json')).models)) {
  const blocks=JSON.parse(read(`data/content/robot-card-pilot/${slug}.json`)).blocks;
  assert.equal(blocks.capabilities[fact.capabilityIndex].text,fact.capability);
  assert.equal(blocks.faq[fact.faqIndex].answer,fact.faq);
 }
});

test('F05 redirect proposal is exact and has existing destinations', () => {
 const rules=read('infra/jino-production/audit-legacy-redirects.conf').split('\n').filter(l=>l.startsWith('RewriteRule'));
 assert.equal(rules.length,2);
 for(const rule of rules){const [,pattern,to,flags]=rule.split(' ');assert.equal(flags,'[R=301,L]');assert.ok(pattern.startsWith('^')&&pattern.endsWith('$'));assert.ok(to.startsWith('/robots/'));
 const old=to.replace('/robots/','/').replace(/\/$/,'');const re=new RegExp(pattern);
 assert.ok(re.test(old.slice(1)));assert.ok(re.test(old.slice(1)+'/'));assert.ok(!re.test(to.slice(1)));assert.ok(!re.test(old.slice(1)+'-other'));
 assert.ok(JSON.parse(read('data/content/robot-card-pilot/'+to.split('/')[2]+'.json')).slug);
 }
});

test('F10 primary editorial hero has explicit loading priority', () => {
 const hero=read('src/components/blocks/EditorialHero.astro');
 assert.match(hero, /class="editorial-hero__image"[^>]*fetchpriority="high"/);
});

test('F10 breadcrumb fallback reserves Montserrat-like width before font load', () => {
 assert.match(read('src/styles/layout.css'), /Montserrat Breadcrumb Fallback/);
 assert.match(read('src/styles/fonts.css'), /size-adjust:\s*114%/);
});

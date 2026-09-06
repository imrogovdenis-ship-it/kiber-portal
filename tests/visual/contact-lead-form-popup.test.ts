import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('lead form popup uses approved minimal fields and legal consent links', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const popup = read('src/components/layout/ContactLeadFormPopup.astro');
  const script = read('public/scripts/contact-lead-form-popup.js');
  const hero = read('src/components/blocks/HomeHero.astro');
  const finalCta = read('src/components/blocks/HomeFinalCta.astro');

  assert.match(layout, /ContactLeadFormPopup/);
  assert.match(hero, /data-lead-form-popup-trigger/);
  assert.match(finalCta, /data-lead-form-popup-trigger/);

  assert.match(popup, /Связаться с нами/);
  assert.match(popup, /Закрыть/);
  assert.match(popup, /Оставьте заявку/);
  assert.match(popup, /Наш менеджер свяжется с вами/);
  assert.match(popup, /method="post" action=\{formAction\}/);
  assert.match(popup, /name="name"[\s\S]*required/);
  assert.match(popup, /name="contact"[\s\S]*required/);
  assert.match(popup, /name="email"[\s\S]*type="email"/);
  assert.doesNotMatch(popup, /<textarea/);
  assert.match(popup, /name="privacy_consent"[\s\S]*required/);
  assert.match(popup, /\/consent\//);
  assert.match(popup, /\/privacy-policy\//);
  assert.match(popup, /\/terms\//);


  assert.match(popup, /input:not\(\[type='checkbox'\]\):not\(\.contact-lead-popup__honeypot\)/);
  assert.match(popup, /contact-lead-popup__honeypot[\s\S]*inset-inline-start: -100vw/);
  assert.match(popup, /contact-lead-popup__honeypot[\s\S]*max-width: \.0625rem/);

  assert.match(script, /fetch\(form\.action/);
  assert.match(script, /FormData\(form\)/);
  assert.match(script, /\/lead\/thanks\/\?request=preview/);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('global messenger popup is wired to approved public contacts and CTA triggers', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const popup = read('src/components/layout/ContactMessengerPopup.astro');
  const popupScript = read('public/scripts/contact-messenger-popup.js');
  const header = read('src/components/layout/Header.astro');
  const homeData = read('src/data/home-live.ts');
  const contactsPage = read('src/pages/contacts.astro');
  const config = read('src/config/site.ts');

  assert.match(layout, /ContactMessengerPopup/);
  assert.match(header, /data-contact-popup-trigger/);
  assert.match(header, /#contact-messengers/);
  assert.match(homeData, /#contact-messengers/);
  assert.match(contactsPage, /data-contact-popup-trigger/);

  assert.match(config, /https:\/\/t\.me\/\+79067309691/);
  assert.match(config, /https:\/\/wa\.me\/79067309691/);
  assert.match(config, /https:\/\/max\.ru\/u\/f9LHodD0cOJhJ-X4IZgcN132WZOzWIuvqM8KhYmQShyPoEZQ-C84DJgI4M0/);

  assert.match(popup, /Связаться с нами/);
  assert.match(popup, /Напишите нам в любом удобном мессенджере/);
  assert.match(popup, /Закрыть/);
  assert.match(popup, /gosha-ushanka-cta2-compact\.avif/);
  assert.match(popup, /MAX/);
  assert.match(popup, /WhatsApp/);
  assert.match(popup, /Telegram/);
  assert.match(popup, /contact-messenger-popup__button/);

  assert.match(popupScript, /data-contact-popup-trigger/);
  assert.match(popupScript, /Escape/);
  assert.match(popupScript, /contact-messenger-popup-open/);
});

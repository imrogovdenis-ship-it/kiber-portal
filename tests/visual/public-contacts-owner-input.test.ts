import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const publicPhone = '+7 (906) 730-96-91';
const publicEmail = 'markinas28@yandex.ru';
const telegram = 'https://t.me/+79067309691';
const whatsapp = 'https://wa.me/79067309691?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82.%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20kiber-portal.ru';
const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const legalName = 'ИП Маркин Александр Сергеевич';
const inn = '771898397717';
const ogrnip = '326774600084499';
const address = 'Нижний Сусальный переулок, 9, стр. 4А';

test('site public config uses owner-approved contacts and requisites as defaults', () => {
  const site = read('src/config/site.ts');

  assert.match(site, new RegExp(escapeRe(publicPhone)));
  assert.match(site, new RegExp(escapeRe(publicEmail)));
  assert.match(site, new RegExp(escapeRe(telegram)));
  assert.match(site, new RegExp(escapeRe(whatsapp)));
  assert.match(site, new RegExp(escapeRe(legalName)));
  assert.match(site, new RegExp(inn));
  assert.match(site, new RegExp(ogrnip));
  assert.match(site, new RegExp(escapeRe(address)));
  assert.doesNotMatch(site, /\+7 000 000-00-00|hello@kiber-portal\.ru|wa\.me\/70000000000|t\.me\/kiber_portal/);
});

test('header and footer render real public contacts from shared site config', () => {
  const header = read('src/components/layout/Header.astro');
  const footer = read('src/components/layout/Footer.astro');

  assert.match(header, /siteConfig\.phone/);
  assert.match(header, /#contact-messengers/);
  assert.match(header, /Написать нам/);
  assert.match(footer, /siteConfig\.legalName/);
  assert.match(footer, /siteConfig\.inn/);
  assert.match(footer, /siteConfig\.ogrnip/);
  assert.match(footer, /siteConfig\.address/);
  assert.match(footer, /siteConfig\.region/);
});

test('public contact pages and docs stop requesting the now-provided public contacts', () => {
  const contacts = read('src/pages/contacts.astro');
  const openQuestions = read('docs/OPEN-QUESTIONS.md');
  const requestPack = read('docs/business-inputs-request.md');

  assert.match(contacts, /siteConfig\.phone/);
  assert.match(contacts, /siteConfig\.email/);
  assert.match(contacts, /siteConfig\.legalName/);
  assert.match(contacts, /siteConfig\.address/);
  assert.doesNotMatch(openQuestions, /Утвердить телефон, TG, WA, email, реквизиты/);
  assert.doesNotMatch(requestPack, /нужны от владельца[\s\S]*Телефон/i);
  assert.match(openQuestions, /Контакты и реквизиты/);
  assert.match(requestPack, /Public contacts approved/);
});

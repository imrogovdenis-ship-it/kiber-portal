import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-38 lead page separates messenger contact and callback request forms', async () => {
  const page = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');

  assert.match(page, /data-contact-section="messengers"/);
  assert.match(page, /Написать нам/);
  assert.match(page, /data-messenger={messenger.key}/);
  assert.match(page, /key: 'max'/);
  assert.match(page, /key: 'telegram'/);
  assert.match(page, /key: 'whatsapp'/);

  assert.match(page, /data-contact-section="callback"/);
  assert.match(page, /Запросить обратный звонок/);
  assert.match(page, /name="name"[^>]*required/);
  assert.match(page, /name="phone"[^>]*required/);
  assert.match(page, /name="email"[^>]*type="email"/);
  assert.doesNotMatch(page, /name="email"[^>]*required/);
  assert.match(page, /name="privacyAgreement"[^>]*type="checkbox"[^>]*required/);
  assert.match(page, /Политик[а-я]+ конфиденциальности/);
  assert.match(page, /обработк[а-я]+ персональных данных/);
});

test('KIBER-38 callback form is feature-gated until real routing secrets exist', async () => {
  const page = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  const env = await readFile(resolve(root, 'src/env.d.ts'), 'utf8');
  const site = await readFile(resolve(root, 'src/config/site.ts'), 'utf8');

  assert.match(env, /PUBLIC_MAX_URL/);
  assert.match(env, /PUBLIC_LEAD_FORM_ENABLED/);
  assert.match(env, /PUBLIC_LEAD_FORM_ENDPOINT/);
  assert.match(site, /max:/);
  assert.match(site, /leadFormEnabled:/);
  assert.match(site, /leadFormEndpoint:/);

  assert.match(page, /leadFormEnabled/);
  assert.match(page, /method="post"/);
  assert.match(page, /disabled={!leadFormEnabled}/);
  assert.match(page, /data-routing="telegram-and-amocrm"/);
  assert.match(page, /data-routing-state={leadFormEnabled \? 'enabled' : 'disabled'}/);
});

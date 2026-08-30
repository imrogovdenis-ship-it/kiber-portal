import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildTelegramLeadMessage,
  loadTelegramLeadConfig,
  sendTelegramLeadDuplicate,
  type LeadPayload,
} from '../../src/server/lead-routing/telegram';

const lead: LeadPayload = {
  name: 'Александр',
  contact: '+7 985 266-65-82',
  email: '',
  robot: 'arenda-unitree-g1',
  event: 'Москва, выставка, 300 гостей',
  sourcePage: '/robots/arenda-unitree-g1/',
  utmSource: 'yandex',
  utmMedium: 'cpc',
  utmCampaign: 'robots',
  submittedAt: '2026-08-30T06:10:00Z',
  deployEnv: 'preview',
};

test('buildTelegramLeadMessage renders the owner-approved template', () => {
  assert.equal(
    buildTelegramLeadMessage(lead),
    `🤖 Новая заявка с KIBER PORTAL

Имя: Александр
Контакт: +7 985 266-65-82
Email: —
Робот/интерес: arenda-unitree-g1
Формат мероприятия: Москва, выставка, 300 гостей

Страница: /robots/arenda-unitree-g1/
UTM source: yandex
UTM medium: cpc
UTM campaign: robots

Время: 2026-08-30T06:10:00Z
Environment: preview`,
  );
});

test('sendTelegramLeadDuplicate skips network calls while live routing is disabled', async () => {
  let calls = 0;
  const result = await sendTelegramLeadDuplicate(lead, {
    enabled: false,
    botToken: '123456789:TEST_TOKEN_SHOULD_NOT_BE_SENT',
    chatId: '-1001234567890',
  }, async () => {
    calls += 1;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });

  assert.deepEqual(result, { ok: true, skipped: 'routing-disabled' });
  assert.equal(calls, 0);
});

test('sendTelegramLeadDuplicate sends Bot API payload without thread ID by default', async () => {
  let requestedUrl = '';
  let requestedBody: unknown;
  const result = await sendTelegramLeadDuplicate(lead, {
    enabled: true,
    botToken: '123456789:TEST_TOKEN',
    chatId: '-1001234567890',
  }, async (url, init) => {
    requestedUrl = String(url);
    requestedBody = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ ok: true, result: { message_id: 8 } }), { status: 200 });
  });

  assert.equal(result.ok, true);
  assert.equal(result.messageId, 8);
  assert.equal(requestedUrl, 'https://api.telegram.org/bot123456789:TEST_TOKEN/sendMessage');
  assert.deepEqual(requestedBody, {
    chat_id: '-1001234567890',
    text: buildTelegramLeadMessage(lead),
    disable_web_page_preview: true,
  });
});

test('loadTelegramLeadConfig keeps thread optional and uses env only', () => {
  const config = loadTelegramLeadConfig({
    LEAD_ROUTING_ENABLED: 'false',
    TELEGRAM_BOT_TOKEN: 'token',
    TELEGRAM_LEADS_CHAT_ID: '-1001234567890',
    DEPLOY_ENV: 'preview',
  });

  assert.deepEqual(config, {
    enabled: false,
    botToken: 'token',
    chatId: '-1001234567890',
    threadId: undefined,
    deployEnv: 'preview',
  });
});

test('repo documents Telegram env names without committing raw token values', () => {
  const envExample = readFileSync('.env.example', 'utf8');
  const plan = readFileSync('docs/lead-flow-integration-plan.md', 'utf8');
  const contract = readFileSync('data/lead/capability-contract.json', 'utf8');

  assert.match(envExample, /LEAD_ROUTING_ENABLED=false/);
  assert.match(envExample, /TELEGRAM_BOT_TOKEN=/);
  assert.match(envExample, /TELEGRAM_LEADS_CHAT_ID=/);
  assert.doesNotMatch(envExample, /\d{7,}:AA[A-Za-z0-9_-]{20,}/);
  assert.match(plan, /Заявки с сайта КИБЕР ПОРТАЛ/);
  assert.match(plan, /TELEGRAM_LEADS_THREAD_ID не используется/);
  assert.match(contract, /"enabled": false/);
  assert.match(contract, /"destinations": \[\]/);
});

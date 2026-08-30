import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

import { handleLeadRequest, handleLeadStatusRequest } from '../../src/server/lead-routing/api-leads';

const root = process.cwd();
const baseEnv = {
  DEPLOY_ENV: 'preview',
  LEAD_ROUTING_ENABLED: 'true',
  LEAD_ROUTING_MODE: 'dry-run',
  AMOCRM_BASE_URL: 'https://portalrent.amocrm.ru',
  AMOCRM_ACCESS_TOKEN: 'fake',
  TELEGRAM_BOT_TOKEN: '123456789:TEST_TOKEN',
  TELEGRAM_LEADS_CHAT_ID: '-1001234567890',
};

test('POST /api/leads returns validation errors without calling external destinations', async () => {
  let calls = 0;
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: '', contact: '', robot: 'arenda-unitree-g1' }),
  });

  const response = await handleLeadRequest(request, baseEnv, async () => {
    calls += 1;
    return new Response('{}');
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.ok, false);
  assert.deepEqual(body.errors, ['name is required', 'contact is required']);
  assert.equal(calls, 0);
});

test('POST /api/leads rejects blocked origins without calling external destinations', async () => {
  let calls = 0;
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
    body: JSON.stringify({ name: 'Тест Гефест', contact: '+700****0000' }),
  });

  const response = await handleLeadRequest(request, {
    ...baseEnv,
    LEAD_ROUTING_MODE: 'live',
    LEAD_ALLOWED_ORIGINS: 'https://preview.kiber-portal.ru,https://kiber-portal.ru',
  }, async () => {
    calls += 1;
    return new Response('{}');
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.ok, false);
  assert.deepEqual(body.errors, ['origin not allowed']);
  assert.equal(calls, 0);
  assert.doesNotMatch(JSON.stringify(body), /evil\.example|AMOCRM|TELEGRAM|token|destination/i);
});

test('POST /api/leads accepts and drops honeypot submissions without external destinations', async () => {
  let calls = 0;
  const logs: unknown[] = [];
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://preview.kiber-portal.ru' },
    body: JSON.stringify({ name: 'Bot', contact: '+700****0000', website: 'https://spam.example' }),
  });

  const response = await handleLeadRequest(request, baseEnv, async () => {
    calls += 1;
    return new Response('{}');
  }, { logSink: (event) => logs.push(event) });
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.ok, true);
  assert.equal(body.mode, 'dry-run');
  assert.equal(body.dropped, true);
  assert.equal(body.reason, 'honeypot');
  assert.equal(calls, 0);
  assert.equal(logs.length, 1);
  assert.doesNotMatch(JSON.stringify(body), /spam\.example|Bot|\+700/);
  assert.doesNotMatch(JSON.stringify(logs), /spam\.example|Bot|\+700/);
});

test('POST /api/leads rate limits repeated submissions before external destinations', async () => {
  let calls = 0;
  const env = {
    ...baseEnv,
    LEAD_ROUTING_MODE: 'live',
    LEAD_RATE_LIMIT_WINDOW_MS: '60000',
    LEAD_RATE_LIMIT_MAX: '1',
  };
  const makeRequest = (id: string) => new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.99' },
    body: JSON.stringify({ request_id: id, name: 'Тест Гефест', contact: '+700****0000' }),
  });
  const fetchImpl = async (url: string) => {
    calls += 1;
    if (String(url).includes('amocrm.ru')) return new Response(JSON.stringify({ _embedded: { unsorted: [{ uid: 'unsorted-rate' }] } }), { status: 200 });
    if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 77 } }), { status: 200 });
    throw new Error(`unexpected URL: ${url}`);
  };

  const first = await handleLeadRequest(makeRequest('lead_rate_001'), env, fetchImpl);
  const second = await handleLeadRequest(makeRequest('lead_rate_002'), env, fetchImpl);
  const body = await second.json();

  assert.equal(first.status, 200);
  assert.equal(second.status, 429);
  assert.equal(body.ok, false);
  assert.deepEqual(body.errors, ['rate limit exceeded']);
  assert.equal(calls, 2, 'only the first accepted lead should call amoCRM and Telegram');
  assert.doesNotMatch(JSON.stringify(body), /203\.0\.113\.99|AMOCRM|TELEGRAM|token|destination/i);
});

test('POST /api/leads dry-run accepts a lead and does not call amoCRM or Telegram', async () => {
  let calls = 0;
  const request = new Request('https://preview.kiber-portal.ru/api/leads?robot=arenda-unitree-g1&utm_source=yandex&utm_medium=cpc&utm_campaign=robots', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', referer: 'https://preview.kiber-portal.ru/robots/arenda-unitree-g1/' },
    body: new URLSearchParams({ name: 'Тест Гефест', contact: '+70000000000', event: 'Preview dry-run test' }),
  });

  const response = await handleLeadRequest(request, baseEnv, async () => {
    calls += 1;
    return new Response('{}');
  });
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.ok, true);
  assert.equal(body.mode, 'dry-run');
  assert.equal(body.channels.amoCRM.skipped, 'dry-run');
  assert.equal(body.channels.telegram.skipped, 'dry-run');
  assert.match(body.requestId, /^lead_/);
  assert.equal(calls, 0);
});

test('POST /api/leads live mode calls amoCRM and Telegram only when explicitly enabled', async () => {
  const urls: string[] = [];
  const request = new Request('https://preview.kiber-portal.ru/api/leads?utm_source=yandex&utm_medium=cpc&utm_campaign=robots', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Тест Гефест', contact: '+70000000000', email: 'test@example.com', robot: 'manual-live-test', event: 'Allowed preview test' }),
  });

  const response = await handleLeadRequest(request, { ...baseEnv, LEAD_ROUTING_MODE: 'live' }, async (url) => {
    urls.push(String(url));
    if (String(url).includes('amocrm.ru')) return new Response(JSON.stringify({ _embedded: { unsorted: [{ uid: 'unsorted-test' }] } }), { status: 200 });
    if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 11 } }), { status: 200 });
    throw new Error(`unexpected URL: ${url}`);
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.mode, 'live');
  assert.equal(body.channels.amoCRM.unsortedUid, 'unsorted-test');
  assert.equal(body.channels.telegram.messageId, 11);
  assert.deepEqual(urls, [
    'https://portalrent.amocrm.ru/api/v4/leads/unsorted/forms',
    'https://api.telegram.org/bot123456789:TEST_TOKEN/sendMessage',
  ]);
});

test('POST /api/leads live mode treats repeated request_id as idempotent and does not duplicate channels', async () => {
  const urls: string[] = [];
  const makeRequest = () => new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      request_id: 'lead_owner_repeat_001',
      name: 'Тест Гефест',
      contact: '+700****0000',
      robot: 'manual-live-test',
    }),
  });
  const fetchImpl = async (url: string) => {
    urls.push(String(url));
    if (String(url).includes('amocrm.ru')) return new Response(JSON.stringify({ _embedded: { unsorted: [{ uid: 'unsorted-repeat' }] } }), { status: 200 });
    if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 22 } }), { status: 200 });
    throw new Error(`unexpected URL: ${url}`);
  };

  const first = await handleLeadRequest(makeRequest(), { ...baseEnv, LEAD_ROUTING_MODE: 'live' }, fetchImpl);
  const second = await handleLeadRequest(makeRequest(), { ...baseEnv, LEAD_ROUTING_MODE: 'live' }, fetchImpl);
  const firstBody = await first.json();
  const secondBody = await second.json();

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(firstBody.requestId, 'lead_owner_repeat_001');
  assert.equal(secondBody.requestId, 'lead_owner_repeat_001');
  assert.equal(secondBody.idempotent, true);
  assert.deepEqual(urls, [
    'https://portalrent.amocrm.ru/api/v4/leads/unsorted/forms',
    'https://api.telegram.org/bot123456789:TEST_TOKEN/sendMessage',
  ]);
});

test('POST /api/leads live mode retries transient external channel failures before succeeding', async () => {
  const amoStatuses = [500, 502, 200];
  const calls: string[] = [];
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ request_id: 'lead_retry_001', name: 'Тест Гефест', contact: '+700****0000' }),
  });

  const response = await handleLeadRequest(request, { ...baseEnv, LEAD_ROUTING_MODE: 'live', LEAD_ROUTING_RETRY_ATTEMPTS: '3' }, async (url) => {
    calls.push(String(url));
    if (String(url).includes('amocrm.ru')) {
      const status = amoStatuses.shift() ?? 200;
      return new Response(JSON.stringify(status === 200 ? { _embedded: { unsorted: [{ uid: 'unsorted-retry' }] } } : { error: 'temporary' }), { status });
    }
    if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 33 } }), { status: 200 });
    throw new Error(`unexpected URL: ${url}`);
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.channels.amoCRM.ok, true);
  assert.equal(body.channels.amoCRM.attempts, 3);
  assert.equal(body.channels.amoCRM.unsortedUid, 'unsorted-retry');
  assert.equal(calls.filter((url) => url.includes('amocrm.ru')).length, 3);
});

test('POST /api/leads live mode returns controlled failure JSON when a channel times out', async () => {
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ request_id: 'lead_timeout_001', name: 'Тест Гефест', contact: '+700****0000' }),
  });

  const response = await handleLeadRequest(request, { ...baseEnv, LEAD_ROUTING_MODE: 'live', LEAD_ROUTING_RETRY_ATTEMPTS: '1' }, async (url) => {
    if (String(url).includes('amocrm.ru')) throw new Error('network timeout');
    if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 44 } }), { status: 200 });
    throw new Error(`unexpected URL: ${url}`);
  });
  const body = await response.json();

  assert.equal(response.status, 502);
  assert.equal(body.ok, false);
  assert.equal(body.requestId, 'lead_timeout_001');
  assert.equal(body.channels.amoCRM.ok, false);
  assert.equal(body.channels.amoCRM.error, 'external-channel-timeout');
  assert.doesNotMatch(JSON.stringify(body), /network timeout|AMOCRM_ACCESS_TOKEN|TELEGRAM_BOT_TOKEN|TEST_TOKEN/);
});

test('POST /api/leads writes sanitized structured logs with trace ID and delivery status', async () => {
  const logs: unknown[] = [];
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-request-id': 'trace-owner-safe-001',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify({
      request_id: 'lead_log_safe_001',
      name: 'Тест Гефест',
      contact: '+700****0000',
      email: 'secret@example.com',
      event: 'Private launch details',
      robot: 'manual-live-test',
    }),
  });

  const response = await handleLeadRequest(
    request,
    { ...baseEnv, LEAD_ROUTING_MODE: 'live' },
    async (url) => {
      if (String(url).includes('amocrm.ru')) return new Response(JSON.stringify({ _embedded: { unsorted: [{ uid: 'unsorted-log' }] } }), { status: 200 });
      if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 55 } }), { status: 200 });
      throw new Error(`unexpected URL: ${url}`);
    },
    { logSink: (event) => logs.push(event) },
  );

  assert.equal(response.status, 200);
  assert.equal(logs.length, 1);
  assert.deepEqual(logs[0], {
    event: 'lead.delivery.completed',
    traceId: 'trace-owner-safe-001',
    requestId: 'lead_log_safe_001',
    deployEnv: 'preview',
    mode: 'live',
    status: 'delivered',
    channels: {
      amoCRM: { ok: true, attempts: 1, skipped: false, error: undefined },
      telegram: { ok: true, attempts: 1, skipped: false, error: undefined },
    },
  });
  assert.doesNotMatch(JSON.stringify(logs), /Тест Гефест|\+700|secret@example.com|Private launch|TEST_TOKEN|AMOCRM_ACCESS_TOKEN|TELEGRAM_BOT_TOKEN|203\.0\.113\.10/);
});

test('POST /api/leads writes sanitized structured failure logs without raw channel errors', async () => {
  const logs: unknown[] = [];
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ request_id: 'lead_log_fail_001', name: 'Тест Гефест', contact: '+700****0000' }),
  });

  const response = await handleLeadRequest(
    request,
    { ...baseEnv, LEAD_ROUTING_MODE: 'live', LEAD_ROUTING_RETRY_ATTEMPTS: '1' },
    async (url) => {
      if (String(url).includes('amocrm.ru')) throw new Error('raw provider timeout with secret-ish detail');
      if (String(url).includes('api.telegram.org')) return new Response(JSON.stringify({ ok: true, result: { message_id: 66 } }), { status: 200 });
      throw new Error(`unexpected URL: ${url}`);
    },
    { logSink: (event) => logs.push(event) },
  );

  assert.equal(response.status, 502);
  assert.equal(logs.length, 1);
  assert.deepEqual(logs[0], {
    event: 'lead.delivery.completed',
    traceId: 'lead_log_fail_001',
    requestId: 'lead_log_fail_001',
    deployEnv: 'preview',
    mode: 'live',
    status: 'failed',
    channels: {
      amoCRM: { ok: false, attempts: 1, skipped: false, error: 'external-channel-timeout' },
      telegram: { ok: true, attempts: 1, skipped: false, error: undefined },
    },
  });
  assert.doesNotMatch(JSON.stringify(logs), /raw provider timeout|secret-ish|Тест Гефест|\+700|TEST_TOKEN|fake/);
});

test('POST /api/leads stores only a minimal redacted backup receipt when a sink is configured', async () => {
  const backupReceipts: unknown[] = [];
  const request = new Request('https://preview.kiber-portal.ru/api/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-request-id': 'trace-backup-001',
      referer: 'https://preview.kiber-portal.ru/robots/arenda-unitree-g1/',
    },
    body: JSON.stringify({
      request_id: 'lead_backup_001',
      name: 'Тест Гефест',
      contact: '+700****0000',
      email: 'secret@example.com',
      event: 'Private event description',
      robot: 'arenda-unitree-g1',
      source_page: 'https://preview.kiber-portal.ru/lead/request/',
    }),
  });

  const response = await handleLeadRequest(
    request,
    baseEnv,
    async () => { throw new Error('dry-run must not call external channels'); },
    { backupSink: (receipt) => backupReceipts.push(receipt) },
  );

  assert.equal(response.status, 202);
  assert.equal(backupReceipts.length, 1);
  assert.deepEqual(backupReceipts[0], {
    traceId: 'trace-backup-001',
    requestId: 'lead_backup_001',
    deployEnv: 'preview',
    mode: 'dry-run',
    status: 'accepted',
    robot: 'arenda-unitree-g1',
    sourcePage: 'https://preview.kiber-portal.ru/lead/request/',
    contactProvided: true,
    emailProvided: true,
    retention: 'minimal-redacted',
  });
  assert.doesNotMatch(JSON.stringify(backupReceipts), /Тест Гефест|\+700|secret@example.com|Private event|TEST_TOKEN|fake/);
});

test('POST /api/leads dry-run redirects browser form submissions to safe confirmation page', async () => {
  let calls = 0;
  const request = new Request('https://preview.kiber-portal.ru/api/leads?robot=arenda-unitree-g1', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'text/html,application/xhtml+xml' },
    body: new URLSearchParams({ name: 'Тест Гефест', contact: '+700****0000', event: 'Preview browser form' }),
  });

  const response = await handleLeadRequest(request, baseEnv, async () => {
    calls += 1;
    return new Response('{}');
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/lead/thanks/?robot=arenda-unitree-g1&request=preview');
  assert.equal(calls, 0);
});

test('lead endpoint stays preview-safe while disabled lead page exposes only working contacts', () => {
  const routePath = resolve(root, 'src/pages/api/leads/index.ts');
  const leadPagePath = resolve(root, 'src/pages/lead/request.astro');
  const astroConfig = readFileSync(resolve(root, 'astro.config.mjs'), 'utf8');
  const contract = JSON.parse(readFileSync(resolve(root, 'data/lead/capability-contract.json'), 'utf8'));
  const leadPage = readFileSync(leadPagePath, 'utf8');

  assert.equal(existsSync(routePath), true, 'source route for /api/leads remains available behind explicit integration work');
  assert.match(readFileSync(routePath, 'utf8'), /POST/);
  assert.doesNotMatch(leadPage, /<form[\s\S]*method="post"[\s\S]*action="\/api\/leads"[\s\S]*>/);
  assert.match(leadPage, /PUBLIC_LEAD_FORM_ENABLED/);
  assert.match(leadPage, /data-lead-form-state=\{leadFormEnabled \? 'enabled' : 'disabled'\}/);
  assert.match(leadPage, /siteConfig\.telegram/);
  assert.match(leadPage, /siteConfig\.whatsapp/);
  assert.match(leadPage, /siteConfig\.max/);
  assert.match(astroConfig, /output:\s*'static'/);
  assert.equal(contract.routing.enabled, false);
  assert.deepEqual(contract.routing.destinations, []);
  assert.equal(contract.deferredIntegrations?.apiLeadsEndpoint?.status, 'preview-dry-run-scaffolded');

  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:api-leads'], 'node --import tsx --test tests/visual/api-leads-endpoint.test.ts');
  assert.equal(pkg.scripts['test:lead-capability'], 'node scripts/lead-capability-contract-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:api-leads/);
  assert.match(pkg.scripts.ci, /npm run test:lead-capability/);
});


test('GET /api/leads/status exposes only a minimal health contract and no routing configuration', async () => {
  const response = await handleLeadStatusRequest({
    ...baseEnv,
    LEAD_ROUTING_MODE: 'live',
    AMOCRM_ACCESS_TOKEN: 'redacted',
    TELEGRAM_BOT_TOKEN: 'redacted',
    TELEGRAM_LEADS_CHAT_ID: '-1001234567890',
  });
  const bodyText = await response.text();
  const body = JSON.parse(bodyText);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(body, {
    ok: true,
    service: 'api-leads',
    status: 'available',
  });

  assert.doesNotMatch(bodyText, /secret-token|AMOCRM|TELEGRAM|portalrent|chat|destination|routing|live|dry-run|disabled|env|credential|token/i);
});

test('nginx serves /api/leads/status as an exact minimal JSON route without env-backed configuration', () => {
  const routePath = resolve(root, 'src/pages/api/leads/status.ts');
  assert.equal(existsSync(routePath), false, 'static Astro must not create a nested /api/leads/status file-vs-directory conflict');

  const nginx = readFileSync(resolve(root, 'nginx.conf'), 'utf8');
  assert.match(nginx, /location = \/api\/leads\/status/);
  assert.match(nginx, /default_type application\/json/);
  assert.match(nginx, /Cache-Control "no-store"/);
  assert.match(nginx, /return 200 '\{"ok":true,"service":"api-leads","status":"available"\}\\n'/);
  assert.doesNotMatch(nginx, /location = \/api\/leads\/status[\s\S]*?(process\.env|AMOCRM|TELEGRAM|LEAD_ROUTING|credential|token|destination|routing)/i);
});

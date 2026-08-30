import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildAmoCrmUnsortedFormPayload,
  loadAmoCrmLeadConfig,
  sendAmoCrmLeadDuplicate,
  type AmoCrmLeadPayload,
} from '../../src/server/lead-routing/amocrm';

const lead: AmoCrmLeadPayload = {
  name: 'Александр',
  contact: '+7 985 266-65-82',
  email: 'lead@example.com',
  robot: 'arenda-unitree-g1',
  event: 'Москва, выставка, 300 гостей',
  sourcePage: 'https://kiber-portal.ru/robots/arenda-unitree-g1/',
  referer: 'https://kiber-portal.ru/',
  ip: '203.0.113.10',
  utmSource: 'yandex',
  utmMedium: 'cpc',
  utmCampaign: 'robots',
  utmContent: 'hero',
  utmTerm: 'аренда робота',
  submittedAtUnix: 1788070000,
  requestId: 'lead-request-1788070000-test',
};

test('buildAmoCrmUnsortedFormPayload maps form fields to amoCRM unsorted/forms', () => {
  assert.deepEqual(buildAmoCrmUnsortedFormPayload(lead), [
    {
      source_name: 'kiber-portal.ru',
      source_uid: 'site-form-lead-request',
      pipeline_id: 10151598,
      created_at: 1788070000,
      request_id: 'lead-request-1788070000-test',
      metadata: {
        form_id: 'lead_request',
        form_name: 'Заполнить форму',
        form_page: 'https://kiber-portal.ru/robots/arenda-unitree-g1/',
        form_sent_at: 1788070000,
        referer: 'https://kiber-portal.ru/',
        ip: '203.0.113.10',
      },
      _embedded: {
        leads: [
          {
            name: 'Заявка с сайта kiber-portal.ru — arenda-unitree-g1',
            responsible_user_id: 13632386,
            custom_fields_values: [
              { field_id: 903417, values: [{ value: 'yandex' }] },
              { field_id: 903413, values: [{ value: 'cpc' }] },
              { field_id: 903415, values: [{ value: 'robots' }] },
              { field_id: 903411, values: [{ value: 'hero' }] },
              { field_id: 903419, values: [{ value: 'аренда робота' }] },
            ],
          },
        ],
        contacts: [
          {
            name: 'Александр',
            custom_fields_values: [
              { field_code: 'PHONE', values: [{ value: '+7 985 266-65-82', enum_code: 'WORK' }] },
              { field_code: 'EMAIL', values: [{ value: 'lead@example.com', enum_code: 'WORK' }] },
            ],
          },
        ],
      },
    },
  ]);
});

test('sendAmoCrmLeadDuplicate skips network calls while live routing is disabled', async () => {
  let calls = 0;
  const result = await sendAmoCrmLeadDuplicate(lead, {
    enabled: false,
    baseUrl: 'https://portalrent.amocrm.ru',
    accessToken: 'fake',
  }, async () => {
    calls += 1;
    return new Response(JSON.stringify({ _embedded: { unsorted: [] } }), { status: 200 });
  });

  assert.deepEqual(result, { ok: true, skipped: 'routing-disabled' });
  assert.equal(calls, 0);
});

test('sendAmoCrmLeadDuplicate posts to unsorted/forms with Bearer auth when enabled', async () => {
  let requestedUrl = '';
  let authHeader = '';
  let requestedBody: unknown;
  const result = await sendAmoCrmLeadDuplicate(lead, {
    enabled: true,
    baseUrl: 'https://portalrent.amocrm.ru',
    accessToken: 'fake',
  }, async (url, init) => {
    requestedUrl = String(url);
    authHeader = String(init?.headers?.['authorization'] ?? init?.headers?.['Authorization']);
    requestedBody = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ _embedded: { unsorted: [{ uid: 'unsorted-1' }] } }), { status: 200 });
  });

  assert.equal(result.ok, true);
  assert.equal(result.unsortedUid, 'unsorted-1');
  assert.equal(requestedUrl, 'https://portalrent.amocrm.ru/api/v4/leads/unsorted/forms');
  assert.equal(authHeader, 'Bearer fake');
  assert.deepEqual(requestedBody, buildAmoCrmUnsortedFormPayload(lead));
});

test('loadAmoCrmLeadConfig uses env and keeps live routing disabled by default', () => {
  assert.deepEqual(loadAmoCrmLeadConfig({
    LEAD_ROUTING_ENABLED: 'false',
    AMOCRM_BASE_URL: 'https://portalrent.amocrm.ru',
    AMOCRM_ACCESS_TOKEN: 'token',
  }), {
    enabled: false,
    baseUrl: 'https://portalrent.amocrm.ru',
    accessToken: 'token',
  });
});

test('repo documents amoCRM env names without committing raw tokens', () => {
  const envExample = readFileSync('.env.example', 'utf8');
  const plan = readFileSync('docs/lead-flow-integration-plan.md', 'utf8');
  const contract = readFileSync('data/lead/capability-contract.json', 'utf8');

  assert.match(envExample, /AMOCRM_BASE_URL=https:\/\/portalrent\.amocrm\.ru/);
  assert.match(envExample, /AMOCRM_ACCESS_TOKEN=op:\/\//);
  assert.doesNotMatch(envExample, /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  assert.match(plan, /pipeline_id: `10151598`/);
  assert.match(plan, /responsible_user_id: `13632386`/);
  assert.match(contract, /"amoCrmDuplicate"/);
  assert.match(contract, /"enabled": false/);
  assert.match(contract, /"destinations": \[\]/);
});

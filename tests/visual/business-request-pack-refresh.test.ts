import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('business request pack reflects closed media and public contacts while listing remaining owner inputs', () => {
  const doc = read('docs/business-inputs-request.md');
  assert.match(doc, /Media rights статус: `approved_by_owner_for_production_media_use`/);
  assert.match(doc, /Public contacts approved: `yes`/);
  assert.doesNotMatch(doc, /передать утверждённые изображения/i);
  assert.doesNotMatch(doc, /нужны от владельца[\s\S]*Телефон/i);
  assert.match(doc, /lead destination/i);
  assert.match(doc, /analytics/i);
  assert.match(doc, /production deploy/i);
  assert.doesNotMatch(doc, /\+7\s?977\s?479\s?07\s?49/);
  assert.doesNotMatch(doc, /tel:\+797/);
});

test('lead-flow integration plan keeps approved contacts public and routing disabled until owner input', () => {
  const doc = read('docs/lead-flow-integration-plan.md');
  assert.match(doc, /Статус: `planned_deferred_until_real_destinations`/);
  assert.match(doc, /public contacts = approved defaults/);
  assert.match(doc, /OP_SERVICE_ACCOUNT_TOKEN|1Password|op:\/\//);
  assert.match(doc, /destinations\s*=\s*\[\]/i);
  assert.match(doc, /live routing\s*=\s*disabled/i);
  assert.doesNotMatch(doc, /\+7\s?977\s?479\s?07\s?49/);
});

test('open questions no longer list media rights or public contacts as open blockers', () => {
  const open = read('docs/OPEN-QUESTIONS.md');
  assert.doesNotMatch(open, /Передать утверждённые изображения и права/);
  assert.doesNotMatch(open, /Утвердить телефон, TG, WA/);
  assert.match(open, /Контакты и реквизиты/);
  const go = json('data/review/production-go-no-go.json');
  assert.equal(go.blockers.length, 4);
  assert.equal(go.productionDecision.status, 'NO_GO');
});

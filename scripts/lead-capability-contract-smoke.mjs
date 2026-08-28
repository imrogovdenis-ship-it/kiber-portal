import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const contractPath = resolve(root, 'data/lead/capability-contract.json');
const requestPagePath = resolve(root, 'src/pages/lead/request.astro');
const contactsPagePath = resolve(root, 'src/pages/contacts.astro');
const reportPath = resolve(root, 'docs/review/kiber-54/lead-capability-contract-report.json');
const failures = [];

assert.equal(existsSync(contractPath), true, 'lead capability contract missing');

const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
if (contract.schemaVersion !== 1) failures.push('schemaVersion must be 1');
if (contract.routing?.mode !== 'capability-only') failures.push('routing.mode must be capability-only');
if (contract.routing?.enabled !== false) failures.push('routing.enabled must remain false');
if (!Array.isArray(contract.routing?.destinations) || contract.routing.destinations.length !== 0) failures.push('routing.destinations must remain an empty array');
if (contract.constraints?.liveLeadRouting !== 'disabled-until-owner-approval') failures.push('liveLeadRouting must remain disabled until owner approval');
if (contract.constraints?.productionContacts !== 'placeholder-only') failures.push('production contacts must remain placeholder-only');
if (contract.constraints?.analyticsProviderIds !== 'disabled') failures.push('analytics provider IDs must remain disabled');

const serialized = JSON.stringify(contract).toLowerCase();
for (const forbidden of ['webhook', 'telegram_token', 'whatsapp', 'email:', 'mailto:', 'crm', 'bitrix', 'amocrm']) {
  if (serialized.includes(forbidden)) failures.push(`contract must not include live destination marker: ${forbidden}`);
}

const requestPage = readFileSync(requestPagePath, 'utf8');
if (!requestPage.includes('method="get"')) failures.push('lead request form must remain static GET');
if (!requestPage.includes('action="/lead/thanks/"')) failures.push('lead request form must route only to local confirmation');
if (requestPage.includes('method="post"')) failures.push('lead request form must not POST');

const contactsPage = readFileSync(contactsPagePath, 'utf8');
if (!contactsPage.includes('lead-routing')) failures.push('contacts page must disclose lead-routing approval blocker');

const report = {
  issue: 'KIBER-54',
  generatedAt: new Date().toISOString(),
  contractPath: 'data/lead/capability-contract.json',
  routingMode: contract.routing?.mode,
  routingEnabled: contract.routing?.enabled,
  destinationsCount: Array.isArray(contract.routing?.destinations) ? contract.routing.destinations.length : null,
  checkedPages: ['src/pages/lead/request.astro', 'src/pages/contacts.astro'],
  status: failures.length ? 'failed' : 'passed',
  failures,
};
mkdirSync(resolve(root, 'docs/review/kiber-54'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-54 lead capability contract smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('KIBER-54 lead capability contract smoke passed: routing remains capability-only with zero live destinations.');

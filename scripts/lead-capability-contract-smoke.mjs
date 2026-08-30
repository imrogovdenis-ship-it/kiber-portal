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
if (contract.constraints?.productionContacts !== 'approved-public-defaults') failures.push('production contacts must remain approved public defaults');
if (contract.constraints?.analyticsProviderIds !== 'disabled') failures.push('analytics provider IDs must remain disabled');

const serializedDestinations = JSON.stringify(contract.routing?.destinations || []).toLowerCase();
for (const forbidden of ['webhook', 'telegram_token', 'email:', 'mailto:', 'crm', 'bitrix', 'amocrm']) {
  if (serializedDestinations.includes(forbidden)) failures.push(`contract must not include live destination marker: ${forbidden}`);
}

const requestPage = readFileSync(requestPagePath, 'utf8');
if (!requestPage.includes('PUBLIC_LEAD_FORM_ENABLED')) failures.push('lead request page must declare the lead-form feature flag');
if (!requestPage.includes("data-lead-form-state={leadFormEnabled ? 'enabled' : 'disabled'}")) failures.push('lead request page must disclose enabled/disabled lead form state');
if (/<form[\s\S]*method="post"[\s\S]*action="\/api\/leads"[\s\S]*>/.test(requestPage)) failures.push('disabled lead request page must not render an unavailable /api/leads submission form');
for (const requiredContact of ['siteConfig.telegram', 'siteConfig.whatsapp', 'siteConfig.max']) {
  if (!requestPage.includes(requiredContact)) failures.push(`lead request page must expose working contact channel: ${requiredContact}`);
}
if (!requestPage.includes('data-analytics-form-state="disabled"')) failures.push('lead request contact links must mark the form state as disabled');

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

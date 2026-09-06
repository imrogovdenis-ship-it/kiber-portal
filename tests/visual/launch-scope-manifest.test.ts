import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

const manifest = readJson('data/review/launch-scope-manifest.json');

test('launch scope manifest records closed approvals and keeps production gates closed', () => {
  assert.equal(manifest.status, 'release_candidate_stabilization_manifest');
  assert.equal(manifest.decision, 'RC_PACKAGE_IN_PROGRESS_NO_PRODUCTION_PERMISSION');
  for (const id of ['public-phone-and-contacts', 'contact-messenger-popup', 'lead-form-popup', 'legal-documents-four-pack']) {
    assert.ok(manifest.approvedLaunchScope.some((entry: { id: string }) => entry.id === id), `${id} missing`);
  }
  assert.equal(manifest.stillGated.productionDeployAllowed, false);
  assert.equal(manifest.stillGated.dnsChangeAllowed, false);
  assert.equal(manifest.stillGated.secretsChangeAllowed, false);
  assert.equal(manifest.stillGated.analyticsProviderCookiesAllowed, false);
  assert.equal(manifest.stillGated.productionLiveLeadRoutingAllowed, false);
  assert.equal(manifest.stillGated.mergeAllowed, false);
});

test('launch scope manifest evidence paths exist for approval-critical items', () => {
  const critical = manifest.approvedLaunchScope.filter((entry: { id: string }) => ['lead-form-popup', 'legal-documents-four-pack'].includes(entry.id));
  for (const entry of critical) {
    for (const evidence of entry.evidence as string[]) assert.equal(existsSync(evidence), true, `${entry.id} evidence missing: ${evidence}`);
    for (const source of entry.sourcePaths as string[]) {
      if (source.endsWith('/')) continue;
      assert.equal(existsSync(source), true, `${entry.id} source missing: ${source}`);
    }
  }
});

test('launch scope manifest excludes raw artifacts and deferred production activations', () => {
  const excluded = JSON.stringify(manifest.notInFirstPublicationScopeByDefault);
  assert.match(excluded, /raw-corpus-archives/);
  assert.match(excluded, /test-results/);
  assert.match(excluded, /analytics-provider-activation/);
  assert.match(excluded, /production-dns-secrets/);
});

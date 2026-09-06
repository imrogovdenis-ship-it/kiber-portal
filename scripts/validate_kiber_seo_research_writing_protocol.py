#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT = Path(__file__).resolve().parents[1]
contract = ROOT / 'data/content-contracts/kiber-seo-research-writing-protocol.json'
required = {
  'schemaVersion','id','status','purpose','pageTypes','outputPackageRequiredFields',
  'researchRequiredFields','researchStages','styleRules','wordstatAccessPolicy',
  'sourceMaterialPolicy','validationCommands','forbiddenActions','ownerInputsNeeded'
}
if not contract.exists():
    print(f'Missing {contract.relative_to(ROOT)}', file=sys.stderr); sys.exit(1)
data = json.loads(contract.read_text())
missing = sorted(required - set(data))
if missing:
    print(f'Missing keys: {missing}', file=sys.stderr); sys.exit(1)
for pt in ['robot_card','compilation','article_detail']:
    assert pt in data['pageTypes'], pt
for field in ['research','seo','aiVisibility','blocks','media','internalLinks','schema','review']:
    assert field in data['outputPackageRequiredFields'], field
for stage in ['wordstatAnalysis','serpAnalysis','competitorGapAnalysis','seoPassport','blockMap','cyberGoshaStylePass']:
    assert any(s.get('id') == stage for s in data['researchStages']), stage
for action in ['production_deploy','dns_change','secret_change','analytics_enable','live_lead_routing_enable','approved_design_change']:
    assert action in data['forbiddenActions'], action
assert data['wordstatAccessPolicy']['doNotPastePasswordsInChat'] is True
print('KIBER SEO research writing protocol validation passed')

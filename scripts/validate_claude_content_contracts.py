#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / 'data/content-contracts/kiber-claude-page-block-contracts.json'
EXAMPLES = ROOT / 'data/content-contracts/examples'
DOCS = ROOT / 'docs/content-contracts/kiber-claude-page-block-contracts.md'
OWNER = ROOT / 'docs/content-contracts/kiber-claude-page-block-contracts-owner-summary.md'

REQUIRED_PAGE_TYPES = {'robot_card', 'compilation', 'article_detail'}
REQUIRED_MEDIA_FIELDS = {'mediaId', 'role', 'src', 'alt', 'actualDescription', 'seoAlt', 'sourceStatus', 'rightsStatus'}
EXPECTED_CLOSING = {
    'robot_card': ['faq', 'finalQuestionsCta', 'articles', 'relatedCatalog'],
    'compilation': ['faq', 'cta2', 'catalogBlock', 'relatedArticles', 'otherCompilations'],
    'article_detail': ['faq', 'cta2', 'catalogBlock', 'relatedArticles', 'relatedCompilations'],
}

def fail(msg):
    print(f'FAIL: {msg}')
    return 1

def main():
    errors = []
    if not CONTRACT.exists():
        return fail(f'missing {CONTRACT}')
    data = json.loads(CONTRACT.read_text(encoding='utf-8'))
    if data.get('project') != 'КИБЕР ПОРТАЛ':
        errors.append('project must be КИБЕР ПОРТАЛ')
    if data.get('status') != 'draft_for_owner_review':
        errors.append('status must remain draft_for_owner_review before owner approval')
    policy = data.get('policy', {})
    for blocked in ['productionDeploy','dnsChange','secretsChanged','analyticsActivation','liveLeadRouting','massPageGeneration','claudeMayChangeDesign']:
        if policy.get(blocked) is not False:
            errors.append(f'policy.{blocked} must be false')
    if policy.get('hermesMapsFieldsWithoutReinterpretingDesign') is not True:
        errors.append('Hermes mapping policy must be true')
    page_types = data.get('pageTypes', {})
    if set(page_types) != REQUIRED_PAGE_TYPES:
        errors.append(f'pageTypes must be exactly {sorted(REQUIRED_PAGE_TYPES)}')
    for page_type, expected_closing in EXPECTED_CLOSING.items():
        pt = page_types.get(page_type, {})
        blocks = pt.get('blocks', [])
        ids = [b.get('id') for b in blocks]
        if len(ids) != len(set(ids)):
            errors.append(f'{page_type} block ids must be unique')
        for required in pt.get('requiredOpening', []):
            if required in ['Header', 'Breadcrumbs']:
                continue
            if required not in ids:
                errors.append(f'{page_type} missing required opening block {required}')
        closing = pt.get('requiredClosing', [])
        if closing != expected_closing:
            errors.append(f'{page_type} requiredClosing must be {expected_closing}, got {closing}')
        for required in expected_closing:
            if required not in ids:
                errors.append(f'{page_type} missing closing block {required}')
        for block in blocks:
            if not block.get('name'):
                errors.append(f'{page_type}.{block.get("id")} missing name')
            if not block.get('purpose') and block.get('id') not in ['faq','cta2','finalQuestionsCta']:
                errors.append(f'{page_type}.{block.get("id")} missing purpose')
            if block.get('required') is True and not block.get('fields'):
                errors.append(f'{page_type}.{block.get("id")} required block missing fields')
            for role in block.get('mediaRoles', []):
                if not isinstance(role, str) or not role:
                    errors.append(f'{page_type}.{block.get("id")} has invalid media role')
        if page_type == 'article_detail':
            middle = pt.get('mandatoryFlexibleMiddle', [])
            if set(middle) != {'plainText','goshaQuote'}:
                errors.append('article_detail mandatoryFlexibleMiddle must be plainText + goshaQuote')
            optional = set(pt.get('optionalBlocks', []))
            for x in ['mediaMoment','robotCardGallery','comparisonBlock','obviousChoice','numberedUseCases','checkpointList','pairedEnumeration','productCard']:
                if x not in optional:
                    errors.append(f'article_detail optionalBlocks missing {x}')
    media_policy = data.get('mediaPolicy', {})
    if not REQUIRED_MEDIA_FIELDS.issubset(set(media_policy.get('requiredFieldsPerImage', []))):
        errors.append('mediaPolicy.requiredFieldsPerImage missing required alt/description/status fields')
    for doc in [DOCS, OWNER]:
        if not doc.exists() or len(doc.read_text(encoding='utf-8')) < 1000:
            errors.append(f'doc missing or too short: {doc}')
    example_files = sorted(EXAMPLES.glob('*.example.json'))
    if len(example_files) != 3:
        errors.append('must have exactly three example content packages')
    seen_types = set()
    for path in example_files:
        obj = json.loads(path.read_text(encoding='utf-8'))
        seen_types.add(obj.get('pageType'))
        for field in data['globalOutputEnvelope']['requiredTopLevelFields']:
            if field not in obj:
                errors.append(f'{path.name} missing top-level {field}')
        for m in obj.get('media', []):
            missing = REQUIRED_MEDIA_FIELDS - set(m)
            if missing:
                errors.append(f'{path.name} media missing {sorted(missing)}')
        seo = obj.get('seo', {})
        for f in ['metaTitle','metaDescription','canonicalPath','primaryKeyword','secondaryKeywords','h1']:
            if f not in seo:
                errors.append(f'{path.name} seo missing {f}')
    if seen_types != REQUIRED_PAGE_TYPES:
        errors.append(f'examples must cover {REQUIRED_PAGE_TYPES}, got {seen_types}')
    if errors:
        print('Claude content contract validation failed:')
        for e in errors:
            print('-', e)
        return 1
    print('Claude content contract validation passed: 3 page types, 3 examples, required SEO/media/block rules present.')
    return 0

if __name__ == '__main__':
    sys.exit(main())

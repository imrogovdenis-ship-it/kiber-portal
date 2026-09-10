import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
for slug in ['arenda-roboshashki','arenda-senserobot']:
    p = root / 'data/content/robot-card-pilot' / (slug + '.json')
    assert p.exists(), f'Missing actual pilot copy: {slug}'
    d=json.loads(p.read_text())
    assert len(d['blocks']['faq']) == 8
    assert len(d['blocks']['capabilities']) == 6
    assert len(d['blocks']['scenarios']) == 6
    assert len({x['question'] for x in d['blocks']['faq']}) == 8
    assert all(len(x['answer']) > 100 for x in d['blocks']['faq'])
    assert all(x['title'] != x['text'] for k in ['capabilities','scenarios'] for x in d['blocks'][k])
    text=json.dumps(d['blocks'],ensure_ascii=False).lower()
    for bad in ['страница помогает','абсолютно безопас','8 часов','26 уровней','расчёт за час','wordstat','serp','preview']:
        assert bad not in text, (slug,bad)
    assert 'hero' not in d['blocks'] and 'gallery' not in d['blocks']
    print(slug, 'PASS')

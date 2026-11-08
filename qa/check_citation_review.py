"""Verify every reconciled field, published copies and unchanged estimate bands."""
import json
from pathlib import Path
import re
import sys

SOW = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SOW / 'canvas'))
from review_amendments import MANIFEST, get

html = (SOW / 'index.html').read_text()
templates = {r['id']: r for r in json.loads(re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1))}
cat = json.loads((SOW / 'canvas/catalog.json').read_text())
connections = {r['id']: r for r in cat['connections']}
manifest = json.loads(MANIFEST.read_text())
assert len(set(templates) | set(cat['lines'])) == 203
assert len(connections) == 75
count = 0
for change in manifest['changes']:
    target = connections[change['id']] if change['entity_type'] == 'connection' else templates.get(change['id'], cat['lines'].get(change['id']))
    assert target is not None, change['id']
    for edit in change['edits']:
        assert get(target, edit['field']) == edit['after'], (change['id'], edit['field'])
        count += 1
baseline = json.loads((SOW / 'qa/citation_estimate_baseline.json').read_text())
for lid, expected in baseline.items():
    actual = templates.get(lid, cat['lines'].get(lid))
    assert {k: actual[k] for k in expected} == expected, lid
assert (SOW / 'site/index.html').read_bytes() == (SOW / 'canvas/index.html').read_bytes()
assert (SOW / 'site/sow/index.html').read_bytes() == (SOW / 'index.html').read_bytes()
runtime = (SOW / 'references.js').read_text()
assert runtime in html and runtime in (SOW / 'canvas/template.html').read_text()
assert 'PRIOR_REVIEW[baseId(c)]' in html
assert count == manifest['field_edits']
print(f'PASS: {count} reconciled fields, 278 records, 203 estimate bands, migration and published copies.')

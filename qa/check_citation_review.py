"""Verify every reconciled field, published copies and unchanged estimate bands."""
import json
from pathlib import Path
import re
import sys

SOW = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SOW / 'canvas'))
from review_amendments import MANIFEST, get
from product_copy import tree as public_copy, sow, RULES

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
        expected = public_copy(edit['after'])
        # Nov 8: the partner's card can carry per-connection wording (connection_prereqs moves a reworded item to the top,
        # connection_overrides replaces text on one connection's fields), and the SOW gets its own version of a line
        if change['entity_type'] == 'connection':
            field = edit['field']
            for before, after in RULES.get('connection_prereqs', {}).get(change['id'], []):
                if isinstance(expected, list) and before in expected:
                    i = expected.index(before)
                    expected = [after] + expected[:i] + expected[i + 1:]
            for before, after in RULES.get('connection_overrides', {}).get(change['id'], {}).get(field, []):
                expected = [after if x == before else x for x in expected] if isinstance(expected, list) else expected.replace(before, after)
            if field.startswith(('sowAvailability', 'sowPrereqs')):
                expected = [sow(x) for x in expected] if isinstance(expected, list) else sow(expected)
            if change['id'] in RULES.get('connection_top', {}) and field in ('prereqs', 'sowPrereqs'):
                # connection_top reordered the list: same items, the pitch-changing ones first
                assert sorted(get(target, field)) == sorted(expected), (change['id'], field)
                count += 1
                continue
            if change['id'] in RULES.get('connection_top', {}) and re.match(r'(sow)?[Pp]rereqs\[\d+\]$', field):
                # connection_top moved the items, so the edited item is found by value in the list
                assert expected in target[field.split('[')[0]], (change['id'], field, expected)
                count += 1
                continue
        assert get(target, edit['field']) == expected, (change['id'], edit['field'], get(target, edit['field']), expected)
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

"""Verify source coverage for the live catalog and retain the independent CP11 audit checks."""
import json
from pathlib import Path
import re
import subprocess
import sys
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit

SOW = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SOW / 'canvas'))
from review_amendments import MANIFEST, RETIRED_CONNECTIONS, get
from product_copy import tree as public_copy, sow, RULES

html = (SOW / 'index.html').read_text()
templates = {r['id']: r for r in json.loads(re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1))}
cat = json.loads((SOW / 'canvas/catalog.json').read_text())
connections = {r['id']: r for r in cat['connections']}
manifest = json.loads(MANIFEST.read_text())
# CP11 is an immutable historical audit. Its record count describes the manifest,
# while the live catalog can acquire new connections and services.
dispositions = {(row['entity_type'], row['id']) for row in manifest['dispositions']}
assert len(dispositions) == manifest['records']
retired_services = {'XB09', 'XB13'}
live_services = set(templates) | set(cat['lines'])
assert not RETIRED_CONNECTIONS.intersection(connections)
assert not retired_services.intersection(live_services)
for entity, record_id in dispositions:
    current = connections if entity == 'connection' else live_services
    retired = RETIRED_CONNECTIONS if entity == 'connection' else retired_services
    assert record_id in current or record_id in retired, f'CP11 record disappeared: {record_id}'

# A reference check is structural. It catches missing citations, invalid origins,
# and citations lost in packaging. A link resolving does not establish a claim.
urls = set()


def source(location, url, title):
    assert isinstance(url, str) and url and url == url.strip(), f'{location}: missing source URL'
    parsed = urlsplit(url)
    assert (parsed.scheme == 'https' and not parsed.username and not parsed.password
            and not parsed.port and parsed.hostname and parsed.path.strip('/')
            and not any(c.isspace() for c in url)
            and (parsed.hostname == 'aem.live' or parsed.hostname.endswith('.aem.live')
                 or parsed.hostname == 'adobe.com' or parsed.hostname.endswith('.adobe.com'))), (location, url)
    assert isinstance(title, str) and title.strip() and title != url, f'{location}: missing source title'
    urls.add(url)


def supporting(location, record):
    for ref in record.get('references', []):
        source(location, ref.get('url'), ref.get('title'))


assert len(connections) == len(cat['connections']), 'duplicate connection ID'
flow_count = 0
for cid, conn in connections.items():
    source(cid, conn['source'].get('url'), conn['source'].get('title'))
    supporting(cid, conn)
    for flow in conn.get('flows', []):
        assert {flow['from'], flow['to']} == {conn['a'], conn['b']}, (cid, flow)
        origin = flow['source']
        source(cid, origin.get('url'), origin.get('title'))
        supporting(cid, flow)
        flow_count += 1
    for lid in conn['lines'] + conn['more']:
        assert lid in cat['lines'], f'{cid}: missing service {lid}'
for lid, line in cat['lines'].items():
    source(lid, line['url'], line['src'])
    supporting(lid, line)
for lid, line in templates.items():
    # This partner-authored workshop carries no Adobe product capability.
    if lid == 'X01' and not line.get('source'):
        assert lid not in cat['lines']
        continue
    source(lid, line['source'], line['sourceTitle'])
    supporting(lid, line)

plain_rules = json.loads((SOW / 'plain_rules.json').read_text())
retired_edits = 0
count = 0
for change in manifest['changes']:
    if change['entity_type'] == 'connection' and change['id'] in RETIRED_CONNECTIONS:
        retired_edits += len(change['edits'])
        continue
    target = connections[change['id']] if change['entity_type'] == 'connection' else templates.get(change['id'], cat['lines'].get(change['id']))
    assert target is not None, change['id']
    for edit in change['edits']:
        # Later reviewed wording is explicitly recorded by field. These rules are
        # applied last in build.py. Compare the published field to the exact
        # approved replacement, including the corresponding entry in a flow.
        field = edit['field']
        section = 'connections' if change['entity_type'] == 'connection' else 'lines'
        rules = plain_rules[section].get(change['id'], {})
        if field in rules:
            assert get(target, field) == rules[field]['after'], (change['id'], field)
            count += 1
            continue
        flow_text = re.fullmatch(r'flows\[(\d+)\]\.what', field)
        if flow_text and 'flows' in rules:
            expected = rules['flows']['after'][int(flow_text[1])]
            assert get(target, field) == expected, (change['id'], field)
            count += 1
            continue
        expected = public_copy(edit['after'])
        if change['entity_type'] == 'service':
            for before, after in RULES.get('template_overrides', {}).get(change['id'], {}).get(edit['field'], []):
                if isinstance(expected, str) and not (after in expected and before not in expected):
                    expected = expected.replace(before, after)
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
assert retired_services.issubset(baseline)
for lid, expected in baseline.items():
    if lid in retired_services:
        continue
    actual = templates.get(lid, cat['lines'].get(lid))
    assert {k: actual[k] for k in expected} == expected, lid
canvas = (SOW / 'canvas/index.html').read_text()
marker = 'const CAT='
assert canvas.count(marker) == 1
embedded, _ = json.JSONDecoder().raw_decode(canvas.partition(marker)[2])
assert embedded == cat, 'rendered canvas differs from current source catalog'
assert (SOW / 'site/index.html').read_bytes() == (SOW / 'canvas/index.html').read_bytes()
# The release adds the RFI tab to the SOW source. Reproduce the packaging
# transformation in a temporary file and verify the full published page.
with TemporaryDirectory() as directory:
    expected_page = Path(directory) / 'index.html'
    expected_page.write_bytes((SOW / 'index.html').read_bytes())
    subprocess.run([sys.executable, str(SOW / 'patch_step49.py'), str(expected_page)], check=True, stdout=subprocess.DEVNULL)
    assert (SOW / 'site/sow/index.html').read_bytes() == expected_page.read_bytes(), 'packaged SOW differs'
runtime = (SOW / 'references.js').read_text()
assert runtime in html and runtime in (SOW / 'canvas/template.html').read_text()
assert 'PRIOR_REVIEW[baseId(c)]' in html
assert count + retired_edits == manifest['field_edits']
print(f'PASS: source URL and title coverage for {len(connections)} connections, {flow_count} flows and '
      f"{len(cat['lines'])} canvas services ({len(urls)} distinct Adobe URLs including supporting sources).")
print(f'PASS: {count} current CP11 field edits, {retired_edits} edits on retired connections, '
      f'{len(baseline) - len(retired_services)} current estimate bands, draft migration and both packaged pages.')

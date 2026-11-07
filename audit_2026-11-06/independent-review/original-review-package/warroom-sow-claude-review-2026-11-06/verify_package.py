"""Read-only verification of the packaged snapshot, inventory and citation coverage."""
from pathlib import Path
import collections
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent
manifest = json.loads((ROOT / 'SNAPSHOT.json').read_text())
expected_paths = {x['path'] for x in manifest['files']} | {'SNAPSHOT.json'}
actual_paths = {p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file()
                and '__pycache__' not in p.parts and '.DS_Store' != p.name}
assert actual_paths == expected_paths, ('File set differs', expected_paths - actual_paths, actual_paths - expected_paths)
for entry in manifest['files']:
    path = ROOT / entry['path']
    assert path.resolve().is_relative_to(ROOT), entry['path']
    data = path.read_bytes()
    assert len(data) == entry['bytes'], ('Size mismatch', entry['path'])
    assert hashlib.sha256(data).hexdigest() == entry['sha256'], ('SHA-256 mismatch', entry['path'])
    if 'git_blob_sha' in entry:
        blob = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        assert blob == entry['git_blob_sha'], ('Git blob mismatch', entry['path'])

original = ROOT / 'original-generator'
catalog = json.loads((original / 'sow/canvas/catalog.json').read_text())
html = (original / 'sow/index.html').read_text()
sow = json.loads(re.search(r'const CATALOG\s*=\s*(\[[\s\S]*?\]);', html).group(1))
services = {k: dict(v) for k, v in catalog['lines'].items()}
for record in sow:
    services[record['id']] = {**services.get(record['id'], {}), **record}
records = {('service', k): v for k, v in services.items()}
records.update({('connection', r['id']): r for r in catalog['connections']})
audit = json.loads((ROOT / 'audit-results/sow-citation-audit-data.json').read_text())
extracted = json.loads((ROOT / 'review-inputs/original-records.json').read_text())
citations = json.loads((ROOT / 'review-inputs/original-citations.json').read_text())
assert len(audit['reviews']) == 278
assert set(records) == {(r['entity_type'], r['id']) for r in audit['reviews']}
assert set(records) == {(r['entity_type'], r['id']) for r in extracted}


def all_urls(value):
    if isinstance(value, str):
        return {value} if value.startswith('https://') else set()
    if isinstance(value, dict):
        return set().union(*(all_urls(v) for v in value.values()))
    if isinstance(value, list):
        return set().union(*(all_urls(v) for v in value))
    return set()


url_map = {}
for row in extracted:
    key = (row['entity_type'], row['id'])
    assert row['record'] == records[key], ('Extracted record differs', key)
    if key[0] == 'service':
        urls = {records[key][k] for k in ('url', 'source', 'source2')
                if isinstance(records[key].get(k), str) and records[key][k].startswith('https://')}
    else:
        urls = all_urls(records[key])
    assert urls == set(row['urls']), ('Source association differs', key)
    url_map[key] = urls
all_original_urls = set().union(*url_map.values())
assert all_original_urls == {s['url'] for s in citations}
for citation in citations:
    expected = {t + ':' + i for (t, i), urls in url_map.items() if citation['url'] in urls}
    assert expected == set(citation['entities']), citation['source_id']
for row in audit['reviews']:
    assert set(row['current_sources']) == url_map[(row['entity_type'], row['id'])], row['id']
assert all_original_urls == {s['url'] for s in audit['sources'] if s['original_citation']}
assert len(audit['sources']) == len({s['url'] for s in audit['sources']}) == 275

counts = {'services': len(services),
          'concepts': sum(v.get('origin') == 'research' for v in services.values()),
          'sow_templates': len(services) - sum(v.get('origin') == 'research' for v in services.values()),
          'canvas_services': len(catalog['lines']), 'connections': len(catalog['connections']),
          'original_urls': len(all_original_urls), 'additional_urls': len(audit['sources']) - len(all_original_urls),
          'source_ledger_urls': len(audit['sources']), 'products_and_systems': len(catalog['products']),
          'plays': len(catalog['plays'])}
assert counts == manifest['expected_counts'], counts
assert sorted(set(services) - set(catalog['lines'])) == manifest['sow_only_service_ids']
for note in manifest['source_copy_normalization']:
    data = (original / note['repository_path']).read_bytes()
    assert hashlib.sha256(data).hexdigest() == note['exact_repository_sha256']
    assert hashlib.sha256(data + b'\n').hexdigest() == note['audit_working_copy_sha256']
    assert audit['metadata']['source_files'][note['repository_path']] == note['audit_working_copy_sha256']
print(json.dumps({'status': 'PASS', 'files_verified': len(manifest['files']),
                  'counts': counts, 'source_copy_normalization': 'Verified; one final LF only.',
                  'scope': 'Package integrity and coverage. Adobe page contents require an independent review.'}, indent=2))
